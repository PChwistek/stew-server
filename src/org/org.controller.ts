
import { Controller, Request, Post, UseGuards, Body, Headers, Req } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Org } from './org.interface'
import { OrgService } from './org.service'
import { OrgPayloadDto } from './payloads/org-payload.dto'
import { PurchasePlanPayload } from './payloads/purchase-plan-payload.dto'

@Controller('/org')
export class OrgController {
  constructor(private readonly orgService: OrgService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('/create')
  async createOrg(@Request() req, @Body() orgPayloadDto: OrgPayloadDto): Promise<Org> {
    const { user } = req
    const theOrg = await this.orgService.create(user, orgPayloadDto)
    return theOrg
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/purchase')
  async purchasePlan(@Request() req, @Body() purchasePayload: PurchasePlanPayload): Promise<string> {
    const { user } = req
    return await this.orgService.purchasePlan(user, purchasePayload)
  }

  @Post('/purchase-completed')
  async create(@Headers('stripe-signature') signature, @Req() request: any) {
    return this.orgService.completePurchase(request.rawBody, signature)

  }
}