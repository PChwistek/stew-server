import { IsEmail, IsNotEmpty , IsLowercase } from 'class-validator'

export class OAuthPayloadDto {

  @IsNotEmpty()
  @IsEmail()
  @IsLowercase()
  readonly email: string

  @IsNotEmpty()
  readonly tokenId: string

  readonly newsletter: boolean

  readonly isExt: boolean

  constructor(email, tokenId, newsletter, isExt) {
    this.email = email
    this.tokenId = tokenId
    this.newsletter = newsletter
    this.isExt = isExt
  }

}