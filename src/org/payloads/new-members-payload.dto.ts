import { IsNotEmpty } from 'class-validator'

export class NewMembersPayloadDto {

  @IsNotEmpty()
  readonly newMembers: Array<string>

  constructor(newMembers) {
    this.newMembers = newMembers
  }

}