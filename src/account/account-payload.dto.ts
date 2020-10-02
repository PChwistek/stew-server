import { IsEmail, IsNotEmpty , IsLowercase, Length } from 'class-validator'

export class AccountPayloadDto {

  @IsNotEmpty()
  @IsEmail()
  @IsLowercase()
  readonly email: string

  @Length(6, 30)
  @IsNotEmpty()
  readonly password: string

  readonly newsletter: boolean

  constructor(email, password, newsletter) {
    this.email = email
    this.password = password
    this.newsletter = newsletter
  }
}