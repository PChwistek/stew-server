import { IsNotEmpty, IsEmail } from 'class-validator'
import { AccountPayloadDto } from './account-payload.dto'

export class LoginAccountDto {

  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsNotEmpty()
  password: string

  LoginAccountDto(accountPayloadDto: AccountPayloadDto) {
    this.email = accountPayloadDto.email
    this.password = accountPayloadDto.password
  }

}