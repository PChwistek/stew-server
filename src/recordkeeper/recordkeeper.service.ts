import { Injectable } from '@nestjs/common'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { ConfigService } from '../config/config.service'
import { PasswordChange } from './passwordchange.interface'
import { PasswordChangeDto } from './passwordchange.dto'

@Injectable()
export class RecordKeeperService {
  constructor(
    @InjectModel('PasswordChange') private readonly psChangeModel: Model<PasswordChange>,
  ){}

  async createPasswordChangeRecord(email, ip, device): Promise<PasswordChange> {
    const passwordChangeRequest = new PasswordChangeDto(email, new Date(), null, false, ip, device, '', '')
    const createdRecord = new this.psChangeModel(passwordChangeRequest)
    await createdRecord.save()
    return createdRecord
  }

  async getPasswordChangeRecordById(id: string): Promise<PasswordChange> {
    return await this.psChangeModel.findOne({ _id: id })
  }

  async completePasswordChangeRecord(recordId, theIp, theDevice): Promise<PasswordChange> {
    return await this.psChangeModel.findOneAndUpdate({ _id: recordId },
       { completed: true, dateCompleted: new Date(), completedIp: theIp, completedDevice: theDevice},
       { returnOriginal: false})
  }

}
