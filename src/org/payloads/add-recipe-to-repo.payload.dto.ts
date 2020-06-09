import { IsNotEmpty } from 'class-validator'

export class AddRecipeToRepoDto {

  @IsNotEmpty()
  readonly repoId: string

  @IsNotEmpty()
  readonly orgId: string

  @IsNotEmpty()
  readonly recipe: string

  constructor(repoId, orgId, recipe) {
    this.repoId = repoId
    this.orgId = orgId
    this.recipe = recipe
  }

}