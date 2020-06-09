import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { EmailGatewayService } from './emailgateway.service'
import { ConfigModule } from '../config/config.module'

//  MongooseModule.forFeature([{ name: 'Org', schema: OrgSchema }], 'stew'
@Module({
  imports: [ConfigModule],
  providers: [EmailGatewayService],
  controllers: [],
  exports: [EmailGatewayService],
})
export class EmailGatewayModule {}
