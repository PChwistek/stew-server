export class CreateAccountDto {
  readonly username: string
  readonly email: string
  password: string

  constructor(username, email, password) {
    this.username = username
    this.email = email
    this.password = password
  }

}