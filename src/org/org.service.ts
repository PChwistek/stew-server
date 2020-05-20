import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { InjectStripe } from 'nestjs-stripe'
import Stripe from 'stripe'
import { Org } from './org.interface'
import { OrgPayloadDto } from './payloads/org-payload.dto'
import { OrgDto } from './org.dto'
import { PurchasePlanPayload } from './payloads/purchase-plan-payload.dto'
import { ConfigService } from '../config/config.service'

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
    const { id } = user
    const fullOrg = new OrgDto(
      orgPayloadDto.name, [id], [id], [],
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

    if (purchasePayload.plan === 'starter') {

      const line_items = purchasePayload.numberOfSeats > 5
        ? [{ price: `${this.configService.get('STARTER_BASE')}`, quantity: 1 },
          { price: `${this.configService.get('STARTER_EXTRA')}`, quantity: purchasePayload.numberOfSeats - 5 }]
        : [{ price: `${this.configService.get('STARTER_BASE')}`, quantity: 1 }]

      const baseUrl = this.configService.get('WEBSITE_URL')

      const session = await this.stripeClient.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items,
        mode: 'subscription',
        success_url: `${baseUrl}/teams`,
        cancel_url: `${baseUrl}/404`,
      })

      return session.id

    } else if (purchasePayload.plan === 'growth') {
      const line_items = purchasePayload.numberOfSeats > 10
      ? [{ price: `${this.configService.get('GROWTH_BASE')}`, quantity: 1 },
        { price: `${this.configService.get('GROWTH_EXTRA')}`, quantity: purchasePayload.numberOfSeats - 10 }]
      : [{ price: `${this.configService.get('GROWTH_BASE')}`, quantity: 1 }]

      const session = await this.stripeClient.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items,
        mode: 'subscription',
        success_url: 'https://staging.getstew.com/teams',
        cancel_url: 'https://staging.getstew.com/404',
      })

      return session.id
    }
  }

}
