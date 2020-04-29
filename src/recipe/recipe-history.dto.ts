import { IsNotEmpty } from 'class-validator'
import { RecipePayloadDto } from './Payloads/recipe-payload.dto'
import { Recipe } from './recipe.interface'

export class RecipeHistoryDto extends RecipePayloadDto {

  @IsNotEmpty()
  readonly recipeId: string

  @IsNotEmpty()
  readonly _recipeV: number

  @IsNotEmpty()
  readonly dateCreated: Date

  @IsNotEmpty()
  readonly dateModified: Date

  constructor(oldRecipe: Recipe) {
    super(oldRecipe.name, oldRecipe.tags, oldRecipe.attributes, oldRecipe.config, oldRecipe.linkPermissions, oldRecipe.forkedFromId)
    this.dateModified = new Date()
    this.dateCreated = oldRecipe.dateCreated
    this.recipeId = oldRecipe._id
    this._recipeV = oldRecipe.__v
  }
}