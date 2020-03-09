import { IsNotEmpty } from 'class-validator'
import { RecipePayloadDto } from './recipe-payload.dto'

export class EditRecipePayloadDto extends RecipePayloadDto {

  @IsNotEmpty()
  readonly _id: string

  constructor(id, name, tags, attributes, config) {
    super(name, tags, attributes, config)
    this._id = id
  }

}