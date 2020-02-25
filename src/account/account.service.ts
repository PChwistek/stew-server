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
    const fullAccount = new AccountDto(accountPayloadDto.email, passwordHash, '')
    const createdAccount = new this.accountModel(fullAccount)
    await createdAccount.save()
    return createdAccount
  }

  async findAll(): Promise<Account[]> {
    return await this.accountModel.find().exec()
  }

  async setUpdatedTime(_id: string): Promise<Account> {
    const theAccount = await this.findOneById(_id)
    theAccount.lastUpdated = new Date()
    const accountModel = new this.accountModel(theAccount)
    return await accountModel.save()
  }

  async findOneById(_id: string): Promise<Account> {
    return await this.accountModel.findOne({ _id }).exec()
  }

  async findOneByEmail(email: string): Promise<Account> {
    return await this.accountModel.findOne({ email }).exec()
  }

}
