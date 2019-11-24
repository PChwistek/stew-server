
import { Injectable } from '@nestjs/common'
import { AccountService } from '../account/account.service'
import { CreateAccountDto } from '../account/create-account.dto'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(private readonly accountService: AccountService) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.accountService.findOne(username)
    if (user) {
      bcrypt.compare(pass, user.password).then(result => {
        return result
      })
    }
    return null
  }

  async createUser(createAccountDto: CreateAccountDto): Promise<any> {
    const user = await this.accountService.findOne(createAccountDto.username)
    if (!user) {
      const saltRounds = 10
      bcrypt.hash(createAccountDto.password, saltRounds).then(hash => {
        createAccountDto.password = hash
        this.accountService.create(createAccountDto)
      })
      return 'success'
    }
    return 'user already exists'
  }

}