import { IsNotEmpty } from 'class-validator'

export class DeleteRecipePayloadDto {

  @IsNotEmpty()
  readonly _id: string

  constructor(id) {
    this._id = id
  }

}