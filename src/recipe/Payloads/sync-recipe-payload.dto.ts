import { IsNotEmpty } from 'class-validator'

export class SyncRecipePayloadDto {

  readonly lastUpdated: Date
  readonly isForced: boolean

  constructor(lastUpdated, isForced) {
    this.lastUpdated = lastUpdated
    this.isForced = isForced
  }

}