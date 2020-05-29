import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { OrgService } from './org.service'
import { OrgController } from './org.controller'
import { OrgSchema } from '../schemas/org.schema'
import { StripeModule } from 'nestjs-stripe'
import { ConfigService } from '../config/config.service'
import { ConfigModule } from '../config/config.module'
import { AccountModule } from '../account/account.module'
import { EmailGatewayModule } from '../emailgateway/emailgateway.module'
import { RecordKeeperModule } from '../recordkeeper/recordkeeper.module'
import { JwtModule } from '@nestjs/jwt'

@Module({
  imports: [ConfigModule, AccountModule, EmailGatewayModule, RecordKeeperModule,
    MongooseModule.forFeature([{ name: 'Org', schema: OrgSchema }], 'stew'),
    StripeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        apiKey: configService.get('STRIPE'),
        apiVersion: null,
      }),
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [OrgService],
  controllers: [OrgController],
  exports: [OrgService],
})
export class OrgModule {}
