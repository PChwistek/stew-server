import { RecipePayloadDto } from './recipe-payload.dto'

export class RecipeDto extends RecipePayloadDto {
  readonly author: string
  readonly authorId: string

  constructor(author: string, authorId: string, recipePayloadDto: RecipePayloadDto) {
    super(
      recipePayloadDto.name,
      recipePayloadDto.tags,
      recipePayloadDto.attributes,
      recipePayloadDto.config,
    )
    this.author = author
    this.authorId = authorId
  }

}