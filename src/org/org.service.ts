import { Model } from 'mongoose'
import { Injectable, BadRequestException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { InjectStripe } from 'nestjs-stripe'
import Stripe from 'stripe'
import { Org } from './org.interface'
import { OrgPayloadDto } from './payloads/org-payload.dto'
import { OrgDto } from './org.dto'
import { PurchasePlanPayload } from './payloads/purchase-plan-payload.dto'
import { ConfigService } from '../config/config.service'
import { Account } from '../account/account.interface'
import { AccountService } from '../account/account.service'

@Injectable()
export class OrgService {
  constructor(
  @InjectModel('Org') private readonly orgModel: Model<Org>,
  @InjectStripe() private readonly stripeClient: Stripe,
  private readonly configService: ConfigService,
  private readonly accountService: AccountService) {}

  async create(user: Account, orgPayloadDto: OrgPayloadDto, stripeCustomerId: string): Promise<Org> {
    const { _id, email } = user
    const fullOrg = new OrgDto(
      orgPayloadDto.name, [{ email, status: 'accepted' }], [_id], [],
      orgPayloadDto.numberOfSeats, new Date(), new Date(),
      orgPayloadDto.plan,
      stripeCustomerId,
    )
    const createdOrg = new this.orgModel(fullOrg)
    await createdOrg.save()
    return createdOrg
  }

  // add repos

  async addRepo(user: Account, repoAdd) {

  }

  async addMembers(members: Array<string>) {
    // add member
    // send emails
  }

  async editRepo() {

  }

  async editMembers() {

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
      event = this.stripeClient.webhooks.constructEvent(body, sig, this.configService.get('STRIPE_WEBHOOK'))
    } catch (err) {
      console.log('err', err)
      throw new BadRequestException(`Webhook Error: ${err.message}`)
    }
    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const theAccount = await this.accountService.findOneByEmail(session.customer_email)
      const thePurchase = await this.stripeClient.subscriptions.retrieve(session.subscription)
      console.log('the purchase', thePurchase)

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

      const newOrg = await this.create(theAccount, new OrgPayloadDto('', numSeats, new Date(), plan), thePurchase.customer.toString())
      this.accountService.setOrgs(theAccount._id, newOrg._id, true)

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
      }
    )
    return billingPortal
  }

}
