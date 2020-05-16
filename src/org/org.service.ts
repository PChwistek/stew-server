import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Org } from './org.interface'
import { OrgPayloadDto } from './org-payload.dto'
import { OrgDto } from './org.dto'

@Injectable()
export class OrgService {
  constructor(@InjectModel('Org') private readonly orgModel: Model<Org>) {}

  async create(user: Account, orgPayloadDto: OrgPayloadDto): Promise<Org> {
    const { id } = user
    const fullOrg = new OrgDto(
      orgPayloadDto.name, [id], [id], [],
      orgPayloadDto.numberOfSeats, new Date(), new Date(),
      orgPayloadDto.plan,
    )
    const createdOrg = new this.orgModel(fullOrg)
    await createdOrg.save()
    return createdOrg
  }

  // add repos

  // add members

}
