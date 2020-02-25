
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { AccountService } from '../account/account.service'
import { AccountPayloadDto } from '../account/account-payload.dto'
import { LoginAccountDto } from '../account/login-account.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly accountService: AccountService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.accountService.findOne(email)
    if (user) {
      const match = await bcrypt.compare(password, user.passwordHash)
      if (match) {
        return user
      }
    }
    return null
  }

  async userExists(email: string): Promise<boolean> {
    const user = await this.accountService.findOne(email)
    return user !== null
  }

  async createUser(payloadAccountDto: AccountPayloadDto): Promise<any> {
    const saltRounds = 10
    const hash = await bcrypt.hash(payloadAccountDto.password, saltRounds)
    const passwordHash = hash
    await this.accountService.create(payloadAccountDto, passwordHash)
    return this.login(new LoginAccountDto())
  }

  async login(account: LoginAccountDto) {
    const payload = { email: account.email, sub: 'the_secret_sauce_09013?//1' }
    const user = await this.accountService.findOne(account.email)
    return {
      username: user.username,
      access_token: this.jwtService.sign(payload),
    }
  }

}