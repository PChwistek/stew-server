import { IsNotEmpty } from 'class-validator'

export class RecipeByLinkDto {

  @IsNotEmpty()
  readonly recipeId: string

  @IsNotEmpty()
  readonly adding: boolean

  constructor(recipeId, adding) {
    this.recipeId = recipeId
    this.adding = adding
  }

}