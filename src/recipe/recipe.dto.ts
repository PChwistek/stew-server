import { RecipePayloadDto } from './Payloads/recipe-payload.dto'

export class RecipeDto extends RecipePayloadDto {
  readonly author: string
  readonly authorId: string
  readonly dateCreated: Date
  readonly dateModified: Date

  constructor(author: string, authorId: string, recipePayloadDto: RecipePayloadDto) {
    super(
      recipePayloadDto.name,
      recipePayloadDto.tags,
      recipePayloadDto.attributes,
      recipePayloadDto.config,
      recipePayloadDto.permissions,
    )
    this.author = author
    this.authorId = authorId
    this.dateCreated = new Date()
    this.dateModified = new Date()
  }

}