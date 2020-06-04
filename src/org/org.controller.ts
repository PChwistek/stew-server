
import { Controller, Request, Post, UseGuards, Body, Headers, Req, Get, Param, Put } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { OrgService } from './org.service'
import { PurchasePlanPayload } from './payloads/purchase-plan-payload.dto'
import { NewMembersPayloadDto } from './payloads/new-members-payload.dto'
import { ResendEmailPayload } from './payloads/resend-email-payload.dto'
import { RemoveMemberPayloadDto } from './payloads/remove-members-payload.dto'
import { NewRepoPayload } from './payloads/new-repo-payload.dto'
import { EditRepoPayload } from './payloads/edit-repo-payload.dto'
import { AddRecipeToRepoDto } from './payloads/add-recipe-to-repo.payload.dto'

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

  @Post('/sub-paid')
  async update(@Headers('stripe-signature') signature, @Req() request: any) {
    return this.orgService.subscriptionRenewal(request.rawBody, signature)
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

  @UseGuards(AuthGuard('jwt'))
  @Post('/remove-member')
  async removeMember(@Request() req, @Body() removeMemberPayload: RemoveMemberPayloadDto): Promise<any> {
    const { account } = req.user
    const { orgId, email } = removeMemberPayload
    return await this.orgService.removeMember(orgId, account, email)
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/resend-group-invite')
  async resendInvites(@Request() req, @Body() resendPayload: ResendEmailPayload): Promise<any> {
    const { account } = req.user
    const { email, orgId } = resendPayload
    return await this.orgService.resendInvite(account, orgId, email)
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

  @UseGuards(AuthGuard('jwt'))
  @Post('/repos')
  async addRepo(@Request() req, @Body() newRepoPayload: NewRepoPayload): Promise<any> {
    const { account } = req.user
    return await this.orgService.addRepo(account, newRepoPayload)
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('/repos')
  async editRepo(@Request() req, @Body() editRepoPayload: EditRepoPayload): Promise<any> {
    const { account } = req.user
    return await this.orgService.editRepo(account, editRepoPayload)
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/repos/recipe')
  async addRecipeToRepo(@Request() req, @Body() addRecipePayload: AddRecipeToRepoDto): Promise<any> {
    const { account } = req.user
    return await this.orgService.addRecipeToRepo(account, addRecipePayload)
  }
}