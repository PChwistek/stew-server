import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AccountService } from './account.service'
import { AccountSchema } from '../schemas/account.schema'

// const accountModel = new AccountDto(new CreateAccountDto('test', 'test@gmail.com', 'test'))

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Account', schema: AccountSchema }])],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountModule {}
