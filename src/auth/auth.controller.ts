
import { Controller, Request, Post, UseGuards, Body, Get, BadRequestException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AuthService } from './auth.service'
import { LoginAccountDto } from '../account/login-account.dto'
import { AccountPayloadDto } from '../account/account-payload.dto'

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

  @Post('/register')
  async createAccount(@Body() payloadAccountDto: AccountPayloadDto) {
    const exists = await this.authService.userExists(payloadAccountDto.email)
    if (!exists) {
      await this.authService.createUser(payloadAccountDto)
      return this.authService.login(new LoginAccountDto(payloadAccountDto.email, payloadAccountDto.password))
    }

    throw new BadRequestException('Account with this email already exists')
  }

}