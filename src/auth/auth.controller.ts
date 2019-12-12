
import { Controller, Request, Post, UseGuards, Body, Get, BadRequestException } from '@nestjs/common'
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
    const exists = await this.authService.userExists(createAccountDto.email)
    if (!exists) {
      return this.authService.createUser(createAccountDto)
    }

    throw new BadRequestException('Account with this email already exists')
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/validate')
  async checkToken() {
    return true
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    return req.user
  }

}