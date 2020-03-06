import { IsNotEmpty } from 'class-validator'
import { WindowConfig } from '../windowConfig.interface'

export class RecipePayloadDto {

  @IsNotEmpty()
  readonly name: string

  readonly tags: Array<string>
  readonly attributes: Array<string>

  @IsNotEmpty()
  readonly config: Array<WindowConfig>

  constructor(name, tags, attributes, config) {
    this.name = name
    this.tags = tags
    this.attributes = attributes
    this.config = config
  }

}