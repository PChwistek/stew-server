import { IsEmail, IsNotEmpty } from 'class-validator'

export class CreateAccountDto {

  @IsNotEmpty()
  @IsEmail()
  readonly email: string

  @IsNotEmpty()
  readonly password: string

  passwordHash: string

  constructor(email, password) {
    this.email = email
    this.password = password
  }

}