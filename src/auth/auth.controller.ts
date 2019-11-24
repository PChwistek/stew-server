
import { Controller, Request, Post, UseGuards, Body, Get } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AuthService } from './auth.service'
import { CreateAccountDto } from '../account/create-account.dto'
import { LoginAccountDto } from '../account/login-account.dto'

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(@Body() loginAccountDto: LoginAccountDto) {
    return this.authService.login(loginAccountDto)
  }

  @Post('/register')
  async createAccount(@Body() createAccountDto: CreateAccountDto) {
    return this.authService.createUser(createAccountDto)
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    return req.user
  }

}