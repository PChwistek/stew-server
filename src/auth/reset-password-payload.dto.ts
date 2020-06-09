import { IsNotEmpty, Length } from 'class-validator'

export class ResetPasswordPayload {

  @Length(6, 30)
  @IsNotEmpty()
  readonly password: string

  constructor(password) {
    this.password = password
  }

}