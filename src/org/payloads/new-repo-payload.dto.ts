import { IsNotEmpty } from 'class-validator'

export class NewRepoPayload {

  @IsNotEmpty()
  readonly orgId: string

  @IsNotEmpty()
  readonly name: string

  readonly recipes: Array<string>

  @IsNotEmpty()
  readonly permittedUsers: Array<string>

  constructor(orgId, name, recipes, permittedUsers) {
    this.orgId = orgId
    this.name = name
    this.recipes = recipes
    this.permittedUsers = permittedUsers
  }

}