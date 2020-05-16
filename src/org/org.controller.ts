
import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Org } from './org.interface'
import { OrgService } from './org.service'
import { OrgPayloadDto } from './org-payload.dto'

@Controller('/org')
export class OrgController {
  constructor(private readonly orgService: OrgService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('/create')
  async createRecipe(@Request() req, @Body() orgPayloadDto: OrgPayloadDto): Promise<Org> {
    const { user } = req
    const theOrg = await this.orgService.create(user, orgPayloadDto)
    return theOrg
  }

}