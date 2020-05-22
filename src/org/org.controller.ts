
import { Controller, Request, Post, UseGuards, Body, Headers, Req, Get, Param } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { OrgService } from './org.service'
import { PurchasePlanPayload } from './payloads/purchase-plan-payload.dto'

@Controller('/org')
export class OrgController {
  constructor(private readonly orgService: OrgService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('/purchase')
  async purchasePlan(@Request() req, @Body() purchasePayload: PurchasePlanPayload): Promise<string> {
    const { account } = req.user
    return await this.orgService.purchasePlan(account, purchasePayload)
  }

  @Post('/purchase-completed')
  async create(@Headers('stripe-signature') signature, @Req() request: any) {
    return this.orgService.completePurchase(request.rawBody, signature)
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/dashboard')
  async getOrgDash(@Request() req): Promise<any> {
    const { account } = req.user
    return await this.orgService.getDashboard(account)
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/manage-billing/:id')
  async goToStripSelfServe(@Param() params): Promise<any> {
    return await this.orgService.generateSelfServeLink(params.id)
  }
}