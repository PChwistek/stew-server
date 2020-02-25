import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Account } from './account.interface'
import { AccountDto } from './account.dto'
import { AccountPayloadDto } from './account-payload.dto'

@Injectable()
export class AccountService {
  constructor(@InjectModel('Account') private readonly accountModel: Model<Account>) {}

  async create(accountPayloadDto: AccountPayloadDto, passwordHash: string): Promise<Account> {
    const fullAccount = new AccountDto(accountPayloadDto, passwordHash)
    const createdAccount = new this.accountModel(fullAccount)
    return await createdAccount.save()
  }

  async findAll(): Promise<Account[]> {
    return await this.accountModel.find().exec()
  }

  async findOne(email: string): Promise<Account> {
    return await this.accountModel.findOne({ email }).exec()
  }

}
