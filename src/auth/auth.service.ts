
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AccountService } from '../account/account.service'
import { CreateAccountDto } from '../account/create-account.dto'
import * as bcrypt from 'bcrypt'
import { LoginAccountDto } from '../account/login-account.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly accountService: AccountService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.accountService.findOne(username)
    if (user) {
      const match = await bcrypt.compare(pass, user.passwordHash)
      return match
    }
    return null
  }

  async createUser(createAccountDto: CreateAccountDto): Promise<any> {
    const user = await this.accountService.findOne(createAccountDto.username)
    if (!user) {
      const saltRounds = 10
      bcrypt.hash(createAccountDto.password, saltRounds).then(hash => {
        createAccountDto.passwordHash = hash
        this.accountService.create(createAccountDto)
      })
      return 'success'
    }
    return 'user already exists'
  }

  async login(account: LoginAccountDto) {
    const payload = { username: account.username, sub: 'the_secret_sauce_09013?//1' }
    return {
      access_token: this.jwtService.sign(payload),
    }
  }

}