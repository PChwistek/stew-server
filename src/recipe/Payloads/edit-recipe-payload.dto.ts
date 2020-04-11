import { IsNotEmpty } from 'class-validator'
import { RecipePayloadDto } from './recipe-payload.dto'

export class EditRecipePayloadDto extends RecipePayloadDto {

  @IsNotEmpty()
  readonly _id: string

  constructor(id, name, tags, attributes, config, permissions) {
    super(name, tags, attributes, config, permissions)
    this._id = id
  }

}