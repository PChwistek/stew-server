
import { Controller, Request, Post, UseGuards, Body, Get, BadRequestException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AuthService } from './auth.service'
import { AccountPayloadDto } from '../account/account-payload.dto'
import { LoginAccountDto } from '../account/login-account.dto'

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

}