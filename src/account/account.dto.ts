import { CreateAccountDto } from './create-account.dto'

export class AccountDto {
  readonly email: string
  readonly passwordHash: string
  karma: number
  dateCreated: Date
  favoriteRecipes: Array<string>

  constructor(createAccountDto: CreateAccountDto) {
    this.email = createAccountDto.email
    this.passwordHash = createAccountDto.passwordHash
    this.karma = 0
    this.dateCreated = new Date()
    this.favoriteRecipes = []
  }

}