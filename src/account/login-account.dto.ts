import { IsNotEmpty, IsEmail } from 'class-validator'

export class LoginAccountDto {

  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsNotEmpty()
  password: string

  constructor(email: string, password: string ) {
    this.email = email
    this.password = password
  }

}