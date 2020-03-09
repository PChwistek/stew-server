import { Length, IsNotEmpty } from 'class-validator'

export class ProfilePayloadDto {

  @Length(2, 20)
  @IsNotEmpty()
  readonly username: string

  constructor(username) {
    this.username = username
  }

}