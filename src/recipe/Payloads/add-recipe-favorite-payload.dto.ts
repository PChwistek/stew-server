import { IsNotEmpty } from 'class-validator'

export class AddRecipeFavoriteDto {

  @IsNotEmpty()
  readonly recipeId: string

  @IsNotEmpty()
  readonly isNew: boolean

  constructor(recipeId, isNew) {
    this.recipeId = recipeId
    this.isNew = isNew
  }

}