import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { OrgService } from './org.service'
import { OrgController } from './org.controller'
import { OrgSchema } from '../schemas/org.schema'
import { StripeModule } from 'nestjs-stripe'
import { ConfigService } from '../config/config.service'
import { ConfigModule } from '../config/config.module'
import { AccountModule } from '../account/account.module'

@Module({
  imports: [ConfigModule, AccountModule, MongooseModule.forFeature([{ name: 'Org', schema: OrgSchema }], 'stew'),
    StripeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        apiKey: configService.get('STRIPE'),
        apiVersion: null,
      }),
    }),
  ],
  providers: [OrgService],
  controllers: [OrgController],
  exports: [OrgService],
})
export class OrgModule {}
