import { IsNotEmpty } from 'class-validator'
import { RecipePayloadDto } from './recipe-payload.dto'

export class EditRecipePayloadDto extends RecipePayloadDto {

  @IsNotEmpty()
  readonly _id: string

  forkedFromId: string

  constructor(id, name, tags, attributes, config, linkPermissions, forkedFromId) {
    super(name, tags, attributes, config, linkPermissions, forkedFromId)
    this._id = id
  }

}