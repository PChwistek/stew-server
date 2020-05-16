import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { OrgService } from './org.service'
import { OrgController } from './org.controller'
import { OrgSchema } from '../schemas/org.schema'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Org', schema: OrgSchema }], 'stew')],
  providers: [OrgService],
  controllers: [OrgController],
  exports: [OrgService],
})
export class OrgModule {}
