
export class AccountDto {
  readonly email: string
  readonly passwordHash: string
  username: string
  dateCreated: Date
  favoriteRecipes: Array<string>
  lastUpdated: Date
  org: Array<string>

  constructor(email, passwordHash, username, org) {
    this.email = email
    this.passwordHash = passwordHash
    this.username = username
    this.dateCreated = new Date()
    this.favoriteRecipes = []
    this.lastUpdated = new Date()
    this.org = org
  }

  updateLastUpdated() {
    this.lastUpdated = new Date()
  }

}