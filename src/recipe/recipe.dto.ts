import { RecipePayloadDto } from './Payloads/recipe-payload.dto'

export class RecipeDto extends RecipePayloadDto {
  readonly author: string
  readonly authorId: string
  readonly dateCreated: Date
  readonly dateModified: Date
  readonly global: boolean
  readonly repos: Array<string>

  constructor(author: string, authorId: string, recipePayloadDto: RecipePayloadDto) {
    super(
      recipePayloadDto.name,
      recipePayloadDto.tags,
      recipePayloadDto.attributes,
      recipePayloadDto.config,
      recipePayloadDto.linkPermissions,
      recipePayloadDto.forkedFromId,
    )
    this.author = author
    this.authorId = authorId
    this.dateCreated = new Date()
    this.dateModified = new Date()
    this.global = false
    this.repos = []
  }

}