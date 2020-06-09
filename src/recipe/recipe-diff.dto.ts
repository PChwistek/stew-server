import { IsNotEmpty } from 'class-validator'

export class RecipeDiffDto {

  @IsNotEmpty()
  readonly recipeId: string

  @IsNotEmpty()
  readonly dateModified: Date

  @IsNotEmpty()
  readonly diff: object

  constructor(recipeId, dateModified, diff) {
    this.recipeId = recipeId
    this.dateModified = dateModified
    this.diff = diff
  }
}