import { IsNotEmpty } from 'class-validator'

export class EditRepoPayload {

  @IsNotEmpty()
  readonly repoId: string

  @IsNotEmpty()
  readonly orgId: string

  @IsNotEmpty()
  readonly name: string

  readonly recipes: Array<string>

  @IsNotEmpty()
  readonly permittedUsers: Array<string>

  constructor(repoId, orgId, name, recipes, permittedUsers) {
    this.repoId = repoId
    this.orgId = orgId
    this.name = name
    this.recipes = recipes
    this.permittedUsers = permittedUsers
  }

}