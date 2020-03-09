import { IsEmail, IsNotEmpty , IsLowercase} from 'class-validator'

export class AccountPayloadDto {

  @IsNotEmpty()
  @IsEmail()
  @IsLowercase()
  readonly email: string

  @IsNotEmpty()
  readonly password: string

  constructor(email, password) {
    this.email = email
    this.password = password
  }

}