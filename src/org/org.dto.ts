import { IsNotEmpty } from 'class-validator'
import { OrgPayloadDto } from './payloads/org-payload.dto'

export class OrgDto extends OrgPayloadDto {

  readonly repos: Array<string>

  @IsNotEmpty()
  readonly members: Array<string>

  @IsNotEmpty()
  readonly admins: Array<string>

  readonly lastPaid: Date

  readonly stripeCustomerId: string

  constructor(name, members, admins, repos, numberOfSeats, paidSince, lastPaid, plan, stripeCustomerId) {
    super(name, numberOfSeats, paidSince, plan)
    this.repos = repos
    this.admins = admins
    this.members = members
    this.lastPaid = lastPaid
    this.stripeCustomerId = stripeCustomerId
  }

}