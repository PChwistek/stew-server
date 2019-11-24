import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from './auth/auth.module'
import { AccountModule } from './account/account.module'

const mongoConnection = 'mongodb://localhost:27017/stew'

@Module({
  imports: [MongooseModule.forRoot(mongoConnection, {useNewUrlParser: true}), AuthModule, AccountModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
