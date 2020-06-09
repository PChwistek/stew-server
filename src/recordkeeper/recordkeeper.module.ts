import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { RecordKeeperService } from './recordkeeper.service'
import { ConfigModule } from '../config/config.module'
import { PasswordChangeSchema } from '../schemas/passwordchange.schema'
import { OrgInviteSchema } from '../schemas/orginvite.schema'

@Module({
  imports: [ConfigModule,
    MongooseModule.forFeature([{ name: 'PasswordChange', schema: PasswordChangeSchema }], 'stew'),
    MongooseModule.forFeature([{ name: 'OrgInvite', schema: OrgInviteSchema }], 'stew'),
  ],
  providers: [RecordKeeperService],
  controllers: [],
  exports: [RecordKeeperService],
})
export class RecordKeeperModule {}
