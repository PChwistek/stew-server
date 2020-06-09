import { IsNotEmpty, IsEmail } from 'class-validator'

export class ResendEmailPayload {

  @IsEmail()
  @IsNotEmpty()
  readonly email: string

  @IsNotEmpty()
  readonly orgId: string

  constructor(email, orgId) {
    this.email = email
    this.orgId = orgId
  }

}