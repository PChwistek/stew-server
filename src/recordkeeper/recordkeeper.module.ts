import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { RecordKeeperService } from './recordkeeper.service'
import { ConfigModule } from '../config/config.module'
import { PasswordChangeSchema } from '../schemas/passwordchange.schema'

@Module({
  imports: [ConfigModule,
    MongooseModule.forFeature([{ name: 'PasswordChange', schema: PasswordChangeSchema }], 'stew'),
  ],
  providers: [RecordKeeperService],
  controllers: [],
  exports: [RecordKeeperService],
})
export class RecordKeeperModule {}
