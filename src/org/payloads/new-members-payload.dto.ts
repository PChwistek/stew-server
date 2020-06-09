import { IsNotEmpty } from 'class-validator'

export class NewMembersPayloadDto {

  @IsNotEmpty()
  readonly orgId: string

  @IsNotEmpty()
  readonly newMembers: Array<string>

  constructor(orgId, newMembers) {
    this.orgId = orgId
    this.newMembers = newMembers
  }

}