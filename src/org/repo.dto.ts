import { IsNotEmpty } from 'class-validator'

export class RepoDto {

  @IsNotEmpty()
  readonly repoId: string

  @IsNotEmpty()
  readonly name: string

  @IsNotEmpty()
  readonly recipes: Array<string>

  @IsNotEmpty()
  readonly permittedUsers: Array<string>

  constructor(repoId, name, recipes, permittedUsers) {
    this.repoId = repoId
    this.name = name
    this.recipes = recipes
    this.permittedUsers = permittedUsers
  }

}