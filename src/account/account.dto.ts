import { AccountPayloadDto } from './account-payload.dto'

export class AccountDto {
  readonly email: string
  readonly passwordHash: string
  username: string
  dateCreated: Date
  favoriteRecipes: Array<string>

  constructor(payloadDto: AccountPayloadDto, passwordHash) {
    this.email = payloadDto.email
    this.passwordHash = passwordHash
    this.username = ''
    this.dateCreated = new Date()
    this.favoriteRecipes = []
  }

}