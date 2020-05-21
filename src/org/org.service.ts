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
// const growthAdditionalSeats = 'plan_HJbNfiDHlGp5Ur'
// const starterAdditionalSeats = 'plan_HJbMwdRClc4TAo'

// const growthPlan = 'plan_HJbLBiVQWECbXk'
// const starterPlan = 'plan_HJbLRoo3frzZHY'

@Injectable()
export class OrgService {
  constructor(
  @InjectModel('Org') private readonly orgModel: Model<Org>,
  @InjectStripe() private readonly stripeClient: Stripe,
  private readonly configService: ConfigService) {}

  async create(user: Account, orgPayloadDto: OrgPayloadDto): Promise<Org> {
    const { _id } = user
    const fullOrg = new OrgDto(
      orgPayloadDto.name, [_id], [_id], [],
      orgPayloadDto.numberOfSeats, new Date(), new Date(),
      orgPayloadDto.plan,
    )
    const createdOrg = new this.orgModel(fullOrg)
    await createdOrg.save()
    return createdOrg
  }

  // add repos

  async addRepo(user: Account, repoAdd) {

  }

  async addMember() {

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
        success_url: `${baseUrl}/teams`,
        cancel_url: `${baseUrl}/teams`,
        customer_email: email,
      })
      return session.id
    }
  }

  async completePurchase(body, sig) {
    let event

    try {
      event =  this.stripeClient.webhooks.constructEvent(body, sig, this.configService.get('STRIPE_WEBHOOK'))
    } catch (err) {
      console.log('err', err)
      throw new BadRequestException(`Webhook Error: ${err.message}`)
    }
    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      console.log('session', session)
      console.log('payer', session.customer_email)
      // Fulfill the purchase...

    }
    // Return a response to acknowledge receipt of the event
    return true
  }

}
