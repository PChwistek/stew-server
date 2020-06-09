import { IsNotEmpty, IsEmail } from 'class-validator'

export class ResetRequestPayload {

  @IsEmail()
  @IsNotEmpty()
  readonly email: string

  constructor(email) {
    this.email = email
  }

}