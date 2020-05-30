
import { Controller, Request, Post, UseGuards, Body, Headers, Req, Get, Param } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { OrgService } from './org.service'
import { PurchasePlanPayload } from './payloads/purchase-plan-payload.dto'
import { NewMembersPayloadDto } from './payloads/new-members-payload.dto'

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
  @Post('/add-member')
  async addMembers(@Request() req, @Body() newMembersPayload: NewMembersPayloadDto): Promise<any> {
    const { account } = req.user
    const { newMembers, orgId } = newMembersPayload
    return await this.orgService.addMembers(account, orgId, newMembers)
  }

  @UseGuards(AuthGuard('jwt-link'))
  @Post('/accept-invite')
  async acceptMemberInvite(@Request() req): Promise<any> {
    const { refId } = req.user
    return await this.orgService.acceptOrgInvite(refId)
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/manage-billing/:id')
  async goToStripSelfServe(@Param() params): Promise<any> {
    return await this.orgService.generateSelfServeLink(params.id)
  }
}