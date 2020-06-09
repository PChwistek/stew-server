import { IsEmail, IsNotEmpty , IsLowercase, Length} from 'class-validator'

export class AccountPayloadDto {

  @IsNotEmpty()
  @IsEmail()
  @IsLowercase()
  readonly email: string

  @Length(6, 30)
  @IsNotEmpty()
  readonly password: string

  constructor(email, password) {
    this.email = email
    this.password = password
  }

}