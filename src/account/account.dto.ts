import { CreateAccountDto } from './create-account.dto'

export class AccountDto {
  readonly username: string
  readonly email: string
  readonly password: string
  karma: number
  dateCreated: Date
  favoriteRecipes: Array<string>

  constructor(createAccountDto: CreateAccountDto) {
    this.username = createAccountDto.username
    this.email = createAccountDto.email
    this.password = createAccountDto.password
    this.karma = 0
    this.dateCreated = new Date()
    this.favoriteRecipes = []
  }

}