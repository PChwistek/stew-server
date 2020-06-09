import { IsNotEmpty } from 'class-validator'

export class RecipePermissionsPayload {

  @IsNotEmpty()
  readonly _id: string

  @IsNotEmpty()
  linkPermissions: Array<string>

  orgId: string

  repos: Array<{ value: string, label: string }>

  constructor(id, linkPermissions, repos, orgId) {
    this._id = id
    this.linkPermissions = linkPermissions
    this.repos = repos
    this.orgId = orgId
  }

}