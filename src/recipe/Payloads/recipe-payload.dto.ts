import { IsNotEmpty } from 'class-validator'
import { WindowConfig } from '../windowConfig.interface'

export class RecipePayloadDto {

  @IsNotEmpty()
  readonly name: string

  readonly tags: Array<string>
  readonly attributes: Array<string>

  @IsNotEmpty()
  readonly config: Array<WindowConfig>

  readonly permissions: Array<string>

  constructor(name, tags, attributes, config, permissions) {
    this.name = name
    this.tags = tags
    this.attributes = attributes
    this.config = config
    this.permissions = permissions
  }

}