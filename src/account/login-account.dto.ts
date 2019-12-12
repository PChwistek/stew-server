import { IsNotEmpty, IsEmail } from 'class-validator'
import { CreateAccountDto } from './create-account.dto'

export class LoginAccountDto {

  // THIS HAS TO BE USERNAME B/C passport will flip!!!
  @IsEmail()
  @IsNotEmpty()
  username: string

  @IsNotEmpty()
  password: string

  LoginAccountDto(createAccountDto: CreateAccountDto) {
    this.username = createAccountDto.email
    this.password = createAccountDto.password
  }

}