import { IsEmail, IsNotEmpty } from 'class-validator'

export class CreateAccountDto {

  @IsNotEmpty()
  readonly username: string

  @IsNotEmpty()
  @IsEmail()
  readonly email: string

  @IsNotEmpty()
  readonly password: string

  passwordHash: string

  constructor(username, email, password) {
    this.username = username
    this.email = email
    this.password = password
  }

}