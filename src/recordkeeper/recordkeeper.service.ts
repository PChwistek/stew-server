import { Injectable } from '@nestjs/common'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { PasswordChange } from './passwordchange.interface'
import { PasswordChangeDto } from './passwordchange.dto'
import { OrgInvite } from './orginvite.interface'
import { OrgInviteDto } from './orginvite.dto'

@Injectable()
export class RecordKeeperService {
  constructor(
    @InjectModel('PasswordChange') private readonly psChangeModel: Model<PasswordChange>,
    @InjectModel('OrgInvite') private readonly orgInviteModel: Model<OrgInvite>,
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

  async createOrgInviteRecord(orgId, adminId, memberId, memberEmail): Promise<OrgInvite> {
    const orgInvite = new OrgInviteDto(orgId, adminId, memberEmail, memberId, new Date(), null, false)
    const orgInviteRecord = new this.orgInviteModel(orgInvite)
    await orgInviteRecord.save()
    return orgInviteRecord
  }

  async findOrgInviteRecord(recordId: string): Promise<OrgInvite> {
    return await this.orgInviteModel.findOne({ _id: recordId })
  }

  async completeOrgInviteRecord(recordId: string): Promise<OrgInvite> {
    return await this.orgInviteModel.findOneAndUpdate({ _id: recordId },
      { completed: true, dateCompleted: new Date()},
      { returnOriginal: false})
  }

  async findMostRecentInvite(orgId: string, memberEmail: string) {
    const orgInvites = await this.orgInviteModel.find({ orgId, memberEmail })
    const mostRecent = orgInvites.reduce((a, b) => {
      return new Date(a.dateRequested) > new Date(b.dateRequested) ? a : b
    })
    return mostRecent
  }

}
