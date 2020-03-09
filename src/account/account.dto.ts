import { AccountPayloadDto } from './account-payload.dto'

export class AccountDto {
  readonly email: string
  readonly passwordHash: string
  username: string
  dateCreated: Date
  favoriteRecipes: Array<string>
  lastUpdated: Date

  constructor(email, passwordHash, username) {
    this.email = email
    this.passwordHash = passwordHash
    this.username = username
    this.dateCreated = new Date()
    this.favoriteRecipes = []
    this.lastUpdated = new Date()
  }

  updateLastUpdated() {
    this.lastUpdated = new Date()
  }

}