
import { Controller, Request, Post, UseGuards, Body, Get, BadRequestException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AuthService } from './auth.service'
import { LoginAccountDto } from '../account/login-account.dto'
import { AccountPayloadDto } from '../account/account-payload.dto'
import { ResetRequestPayload } from './reset-request-payload.dto'
import { ResetPasswordPayload } from './reset-password-payload.dto'

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(@Body() loginAccountDto: LoginAccountDto) {
    return this.authService.login(loginAccountDto)
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/validate')
  async checkToken() {
    return true
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    const { username } = req.user
    return {
      username,
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('orgs')
  getOrgs(@Request() req) {
    const { orgs } = req.user
    return {
      orgs,
    }
  }

  @Post('/register')
  async createAccount(@Body() payloadAccountDto: AccountPayloadDto) {
    const exists = await this.authService.userExists(payloadAccountDto.email)
    if (!exists) {
      await this.authService.createUser(payloadAccountDto)
      return this.authService.login(new LoginAccountDto(payloadAccountDto.email, payloadAccountDto.password))
    }

    throw new BadRequestException('Account with this email already exists')
  }

  @Post('/reset-request')
  async requestReset(@Body() resetPasswordPayload: ResetRequestPayload) {
    const exists = await this.authService.userExists(resetPasswordPayload.email)
    if (!exists) {
      throw new BadRequestException('No account with this email exists.')
    }

    return this.authService.generateResetLink(resetPasswordPayload.email)
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/reset-password')
  async resetPassword(@Request() req, @Body() resetPasswordPayload: ResetPasswordPayload) {
    const { user } = req
    return this.authService.resetPassword(user, resetPasswordPayload.password)
  }

}