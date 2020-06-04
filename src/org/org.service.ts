import { Model } from 'mongoose'
import { Injectable, BadRequestException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { JwtService } from '@nestjs/jwt'
import { InjectStripe } from 'nestjs-stripe'
import Stripe from 'stripe'
import { Org } from './org.interface'
import { OrgPayloadDto } from './payloads/org-payload.dto'
import { OrgDto } from './org.dto'
import { PurchasePlanPayload } from './payloads/purchase-plan-payload.dto'
import { ConfigService } from '../config/config.service'
import { Account } from '../account/account.interface'
import { AccountService } from '../account/account.service'
import { EmailGatewayService } from '../emailgateway/emailgateway.service'
import { RecordKeeperService } from '../recordkeeper/recordkeeper.service'
import { NewRepoPayload } from './payloads/new-repo-payload.dto'
import { RepoDto } from './repo.dto'
import { EditRepoPayload } from './payloads/edit-repo-payload.dto'
import { AddRecipeToRepoDto } from './payloads/add-recipe-to-repo.payload.dto'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class OrgService {
  constructor(
    @InjectModel('Org') private readonly orgModel: Model<Org>,
    @InjectStripe() private readonly stripeClient: Stripe,
    private readonly configService: ConfigService,
    private readonly accountService: AccountService,
    private readonly emailService: EmailGatewayService,
    private readonly jwtService: JwtService,
    private readonly recordService: RecordKeeperService,
  ) {}

  async create(user: Account, orgPayloadDto: OrgPayloadDto, stripeCustomerId: string, validUntil: Date): Promise<Org> {
    const { _id, email } = user
    const fullOrg = new OrgDto(
      orgPayloadDto.name, [{ email, status: 'accepted' }], [_id], [],
      orgPayloadDto.numberOfSeats, new Date(), validUntil,
      orgPayloadDto.plan,
      stripeCustomerId,
    )
    const createdOrg = new this.orgModel(fullOrg)
    await createdOrg.save()
    return createdOrg
  }

  async addRepo(user: Account, repoPayload: NewRepoPayload) {
    const { orgId } = repoPayload
    const theOrg = await this.orgModel.findOne({ _id: orgId })

    const tempRepos = theOrg.repos

    const newRpo = new RepoDto(uuidv4(), repoPayload.name, repoPayload.recipes, repoPayload.permittedUsers)

    tempRepos.push(newRpo)

    await this.orgModel.findOneAndUpdate({ _id: orgId }, { repos: tempRepos })
    return true
  }

  async addMembers(invitedBy: Account, orgId: string, members: Array<string>) {

    const theOrg = await this.orgModel.findOne({ _id: orgId })
    if (theOrg.members + members.length > theOrg.numberOfSeats) {
      throw new BadRequestException('More members than seats')
    }
    members = members.map(member => member.toLowerCase())
      .filter(member => theOrg.members.findIndex(existing => existing.email === member) === -1)

    const newMembers = []

    for (const member of members) {
      const theAccount = await this.accountService.findOneByEmail(member)
      if (!theAccount || theAccount.orgs.length === 0) {
        newMembers.push({
          email: member,
          status: 'invited',
          id: theAccount ? theAccount._id : null,
        })
      }
    }

    let newMembersToSave = theOrg.members
    newMembersToSave = newMembersToSave.concat(newMembers)
    await this.orgModel.findOneAndUpdate({ _id: orgId },
      { members: newMembersToSave,  $inc: { __v: 1 }},
      { returnOriginal: false})

    for (const member of newMembers) {

      const inviteRecord = await this.recordService.createOrgInviteRecord(theOrg._id, invitedBy._id, member.id, member.email)
      const payload = { refId: inviteRecord._id }
      const baseUrl = this.configService.get('WEBSITE_URL')
      const token = this.jwtService.sign(payload, { expiresIn: '7d'} )
      const url = `${baseUrl}/accept-invite/${token}`

      setTimeout(() => {
        this.emailService.sendOrganizationInvite(invitedBy.email, member.email, url)
      }, 1000)
    }
    return true
  }

  async acceptOrgInvite(recordKeeperId) {

    const theRecord = await this.recordService.findOrgInviteRecord(recordKeeperId)
    const { orgId, memberEmail, memberId, completed } = theRecord

    if (completed) {
      return { status: 'invalid' }
    }

    const theOrg = await this.orgModel.findOne({ _id: orgId })
    const updatedMembers = theOrg.members

    const theIndex = updatedMembers.findIndex(member => member.email === memberEmail)
    updatedMembers[theIndex] = { email: memberEmail, status: 'accepted' }
    await this.orgModel.findOneAndUpdate({ _id: orgId },
      { members: updatedMembers },
      { returnOriginal: false})

    await this.recordService.completeOrgInviteRecord(recordKeeperId)

    if (memberId) {
      await this.accountService.setOrgs(memberId, orgId, true)
    }

    return { status: 'accepted' }
  }

  async resendInvite(invitedBy: Account, orgId: string, memberEmail: string) {

    const theOrg = await this.orgModel.findOne({ _id: orgId })

    const theIndex = theOrg.members.findIndex(member => member.email === memberEmail)
    if (theIndex === -1) throw new BadRequestException()
    else if (theOrg.members[theIndex].status === 'accepted') throw new BadRequestException()

    const theAccount = await this.accountService.findOneByEmail(memberEmail)

    const mostRecentInvite = await this.recordService.findMostRecentInvite(orgId, memberEmail)

    let minutesDiff = (new Date().getTime() - mostRecentInvite.dateRequested.getTime()) / 1000
    minutesDiff /= 60
    if (Math.abs(Math.round(minutesDiff)) < 15) {
      throw new BadRequestException('Please wait 15 minutes before re-sending an invite.')
    }

    const inviteRecord = await this.recordService.createOrgInviteRecord(orgId, 
      invitedBy._id, theAccount ? theAccount._id : null, memberEmail,
    )

    const payload = { refId: inviteRecord._id }
    const baseUrl = this.configService.get('WEBSITE_URL')
    const token = this.jwtService.sign(payload, { expiresIn: '7d'} )
    const url = `${baseUrl}/accept-invite/${token}`
    this.emailService.sendOrganizationInvite(invitedBy.email, memberEmail, url)
    return true
  }

  async editRepo(user: Account, editRepoPayload: EditRepoPayload) {
    const { orgId } = editRepoPayload
    const theOrg = await this.orgModel.findOne({ _id: orgId })

    const theRepoIndex = theOrg.repos.findIndex(repo => repo.repoId === editRepoPayload.repoId)
    const theRepo = new RepoDto(editRepoPayload.repoId, editRepoPayload.name, editRepoPayload.recipes, editRepoPayload.permittedUsers)
    const repos = theOrg.repos
    repos[theRepoIndex] = theRepo

    await this.orgModel.findOneAndUpdate({ _id: editRepoPayload.orgId }, { repos })
    return true
  }

  async addRecipeToRepo(user: Account, addRecipeDto: AddRecipeToRepoDto) {
    const { orgId, repoId, recipe } = addRecipeDto
    const theOrg = await this.orgModel.findOne({ _id: orgId })

    const repos = theOrg.repos
    const theRepoIndex = theOrg.repos.findIndex(repo => repo.repoId === repoId)

    const theRepo = theOrg.repos[theRepoIndex]
    theRepo.recipes.push(recipe)
    repos[theRepoIndex] = theRepo

    await this.orgModel.findOneAndUpdate({ _id: addRecipeDto.orgId }, { repos })
    return true
  }

  async makeMemberAdmin(orgId, theAccount, theMember) {
    // add to admin list
    const theOrg = await this.orgModel.findOne({ _id: orgId })
    const invitedAccount = await this.accountService.findOneByEmail(theMember)

    let tempAdmins
    if (theOrg.admins.includes(theAccount._id)) {
      tempAdmins = theOrg.admins
      tempAdmins.push(invitedAccount._id)
    }

    await this.orgModel.findOneAndUpdate({ _id: orgId },
      { admins: tempAdmins,  $inc: { __v: 1 }},
      { returnOriginal: false})
    this.emailService.sendNewAdminNotice(theAccount.email, invitedAccount.email)
    return true
  }

  async removeMemberAdmin(orgId, theAccount, theMember) {
    // add to admin list
    const theOrg = await this.orgModel.findOne({ _id: orgId })
    const invitedAccount = await this.accountService.findOneByEmail(theMember)

    let tempAdmins
    if (theOrg.admins.includes(theAccount._id)) {
      tempAdmins = theOrg.admins
      tempAdmins = tempAdmins.filter(adminId => adminId !== invitedAccount._id)
    }

    await this.orgModel.findOneAndUpdate({ _id: orgId },
      { admins: tempAdmins,  $inc: { __v: 1 }},
      { returnOriginal: false})
    return true
  }

  async removeMember(orgId: string, theAccount: Account, theMember: string) {
    const theOrg = await this.orgModel.findOne({ _id: orgId })
    const memberAccount = await this.accountService.findOneByEmail(theMember)
    const memberAccountExists = memberAccount !== null
    const removingAdmin = memberAccountExists && theOrg.admins.includes(memberAccount._id)

    if (!memberAccountExists) {
      if (theOrg.members.findIndex(orgMember => orgMember.email === theMember) === -1) throw new BadRequestException('Not a member')
    }

    if (memberAccountExists && removingAdmin && theOrg.admins.length === 1) {
      throw new BadRequestException('There must be at least 1 other assigned admin before you remove your admin status.')
    }

    let tempAdmins = theOrg.admins
    if (memberAccountExists && theOrg.admins.includes(memberAccount._id)) {
      tempAdmins = theOrg.admins
      tempAdmins = tempAdmins.filter(adminId => adminId !== memberAccount._id)
    }

    let tempMembers = theOrg.members
    if (theOrg.admins.includes(theAccount._id)) {
      tempMembers = theOrg.members
      tempMembers = tempMembers.filter(orgMember => orgMember.email !== theMember)
    }

    await this.orgModel.findOneAndUpdate({ _id: orgId },
      { members: tempMembers, admins: tempAdmins, $inc: { __v: 1 }},
      { returnOriginal: false})

    this.emailService.sendRemovedFromOrganization(theAccount.email, theMember)
    return true

  }

  async purchasePlan(user: Account, purchasePayload: PurchasePlanPayload) {

    const { email } = user
    const baseUrl = this.configService.get('WEBSITE_URL')
    let line_items = []
    if (purchasePayload.plan === 'starter') {

      line_items = purchasePayload.numberOfSeats > 5
        ? [{ price: `${this.configService.get('STARTER_BASE')}`, quantity: 1 },
          { price: `${this.configService.get('STARTER_EXTRA')}`, quantity: purchasePayload.numberOfSeats - 5 }]
        : [{ price: `${this.configService.get('STARTER_BASE')}`, quantity: 1 }]
    } else if (purchasePayload.plan === 'growth') {
      line_items = purchasePayload.numberOfSeats > 10
      ? [{ price: `${this.configService.get('GROWTH_BASE')}`, quantity: 1 },
        { price: `${this.configService.get('GROWTH_EXTRA')}`, quantity: purchasePayload.numberOfSeats - 10 }]
      : [{ price: `${this.configService.get('GROWTH_BASE')}`, quantity: 1 }]

    }

    if (line_items.length > 0) {
      const session = await this.stripeClient.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items,
        mode: 'subscription',
        success_url: `${baseUrl}/purchase-success`,
        cancel_url: `${baseUrl}/teams`,
        customer_email: email,
      })
      return session.id
    }
  }

  async completePurchase(body, sig) {
    let event

    try {
      event = this.stripeClient.webhooks.constructEvent(body, sig, this.configService.get('STRIPE_WEBHOOK_INITIAL_PURCHASE'))
    } catch (err) {
      console.log('err', err)
      throw new BadRequestException(`Webhook Error: ${err.message}`)
    }
    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const theAccount = await this.accountService.findOneByEmail(session.customer_email)
      const thePurchase = await this.stripeClient.subscriptions.retrieve(session.subscription)

      const periodEnd = new Date(thePurchase.current_period_end * 1000)

      const thePlans = thePurchase.items.data
      let numSeats = 0
      let plan = ''
      for (let index = 0; index < thePlans.length; index++) {
        const element = thePlans[index]
        if (element.plan.nickname === 'Growth Plan - Base') {
          plan = 'growth'
          numSeats += 10
        } else if (element.plan.nickname === 'Starter Plan - Base') {
          plan = 'starter'
          numSeats += 5
        } else if (element.plan.nickname === 'Stew Additional Seats' || 'Stew Growth - Additional Seats') {
          numSeats += element.quantity
        }
      }

      const newOrg = await this.create(theAccount, new OrgPayloadDto('', numSeats, new Date(), plan), thePurchase.customer.toString(), periodEnd)
      this.accountService.setOrgs(theAccount._id, newOrg._id, true)

    }
    // Return a response to acknowledge receipt of the event
    return true
  }

  async subscriptionRenewal(body, sig) {
    let event
    try {
      event = this.stripeClient.webhooks.constructEvent(body, sig, this.configService.get('STRIPE_WEBHOOK_RENEW'))
    } catch (err) {
      console.log('err', err)
      throw new BadRequestException(`Webhook Error: ${err.message}`)
    }

    if (event.type === 'invoice.payment_succeeded') {
      const session = event.data.object
      const periodEnd = new Date(session.current_period_end * 1000)

      const theOrg = await this.orgModel.findOne({ stripeCustomerId: session.customer })

      await this.orgModel.findOneAndUpdate({ _id: theOrg._id }, { validUntil: periodEnd })

    }
    // Return a response to acknowledge receipt of the event
    return true
  }

  async getDashboard(user: Account) {
    if (user.orgs && user.orgs.length > 0) {
      const theOrg = await this.orgModel.findOne({ _id: user.orgs[0] })
      if (theOrg) {
        return {
          hasOrg: true,
          isAdmin: theOrg.admins.includes(`${user._id}`),
          ...theOrg._doc,
        }
      }
    }

    return {
      hasOrg: false,
      isAdmin: false,
    }
  }

  async generateSelfServeLink(repoId: string) {
    const theOrg = await this.orgModel.findOne({ _id: repoId })
    const baseUrl = this.configService.get('WEBSITE_URL')

    const billingPortal = await this.stripeClient.billingPortal.sessions.create(
      {
        customer: theOrg.stripeCustomerId,
        return_url:  `${baseUrl}/teams`,
      },
    )
    return billingPortal
  }

}
