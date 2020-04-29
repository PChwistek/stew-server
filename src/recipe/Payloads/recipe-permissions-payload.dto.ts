import { IsNotEmpty } from 'class-validator'

export class RecipePermissionsPayload {

  @IsNotEmpty()
  readonly _id: string

  @IsNotEmpty()
  linkPermissions: Array<string>

  repos: Array<string>

  constructor(id, linkPermissions, repos) {
    this._id = id
    this.linkPermissions = linkPermissions
    this.repos = repos
  }

}