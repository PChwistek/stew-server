
import { Controller, Request, Post, UseGuards, Body, Get, BadRequestException, Req } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AccountService } from './account.service'
import { request } from 'http'
import { ProfilePayloadDto } from './profile-payload.dto'

@Controller('/account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('profile')
  async setProfile(@Request() req, @Body() profilePayloadDto: ProfilePayloadDto): Promise<string> {
    const { user } = req
    await this.accountService.addProfile(user._id, profilePayloadDto.username)
    this.accountService.setUpdatedTime(user._id)
    return profilePayloadDto.username
  }

}