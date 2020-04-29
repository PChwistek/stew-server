import { IsNotEmpty } from 'class-validator'
import { WindowConfig } from '../windowConfig.interface'

export class RecipePayloadDto {

  @IsNotEmpty()
  readonly name: string

  readonly tags: Array<string>
  readonly attributes: Array<string>

  @IsNotEmpty()
  readonly config: Array<WindowConfig>

  readonly linkPermissions: Array<string>

  readonly forkedFromId: string

  constructor(name, tags, attributes, config, linkPermissions, forkedFromId) {
    this.name = name
    this.tags = tags
    this.attributes = attributes
    this.config = config
    this.linkPermissions = linkPermissions || ['any']
    this.forkedFromId = forkedFromId || ''
  }

}