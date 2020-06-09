
import { Controller, Request, Post, UseGuards, Body, Get, BadRequestException, Headers } from '@nestjs/common'
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

  @UseGuards(AuthGuard('jwt-link'))
  @Get('/validate-link')
  async checkLinkToken() {
    return true
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    const { username } = req.user.account
    return {
      username,
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('orgs')
  getOrgs(@Request() req) {
    const { orgs } = req.user.account
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
  async requestReset(@Headers() headers, @Request() request, @Body() resetPasswordPayload: ResetRequestPayload) {
    const exists = await this.authService.userExists(resetPasswordPayload.email)
    if (!exists) {
      throw new BadRequestException('No account with this email exists.')
    }

    return this.authService.generateResetLink(resetPasswordPayload.email, request.ip, headers['user-agent'])
  }

  @UseGuards(AuthGuard('jwt-link'))
  @Post('/reset-password')
  async resetPassword(@Headers() headers, @Request() req, @Body() resetPasswordPayload: ResetPasswordPayload) {
    const { refId } = req.user
    return this.authService.resetPassword(resetPasswordPayload.password, refId, req.ip, headers['user-agent'])
  }

}