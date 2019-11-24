import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Account } from './account.interface'
import { AccountDto } from './account.dto'
import { CreateAccountDto } from './create-account.dto'

@Injectable()
export class AccountService {
  constructor(@InjectModel('Account') private readonly accountModel: Model<Account>) {}

  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    const fullAccount = new AccountDto(createAccountDto)
    const createdAccount = new this.accountModel(fullAccount)
    return await createdAccount.save()
  }

  async findAll(): Promise<Account[]> {
    return await this.accountModel.find().exec()
  }

  async findOne(username: string): Promise<Account> {
    return await this.accountModel.findOne({ username }).exec()
  }

}
