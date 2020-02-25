import { IsEmail, IsNotEmpty } from 'class-validator'

export class AccountPayloadDto {

  @IsNotEmpty()
  @IsEmail()
  readonly email: string

  @IsNotEmpty()
  readonly password: string

  constructor(email, password) {
    this.email = email
    this.password = password
  }

}