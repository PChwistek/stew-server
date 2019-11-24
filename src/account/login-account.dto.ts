import { IsNotEmpty } from 'class-validator'

export class LoginAccountDto {

  @IsNotEmpty()
  readonly username: string

  @IsNotEmpty()
  readonly password: string

}