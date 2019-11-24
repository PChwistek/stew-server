
import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AuthService } from './auth.service'
import { CreateAccountDto } from '../account/create-account.dto'

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(@Request() req) {
    return req.user
  }

  @Post('/register')
  async createAccount(@Body() createAccountDto: CreateAccountDto) {
    return this.authService.createUser(createAccountDto)
  }

}