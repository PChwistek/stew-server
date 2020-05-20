import { IsNotEmpty, IsNumber, IsDate } from 'class-validator'

export class OrgPayloadDto {

  @IsNotEmpty()
  readonly name: string

  @IsNumber()
  @IsNotEmpty()
  readonly numberOfSeats: number

  readonly paidSince: Date

  @IsNotEmpty()
  readonly plan: string

  constructor(name, numberOfSeats, paidSince, plan) {
    this.name = name
    this.numberOfSeats = numberOfSeats
    this.paidSince = paidSince
    this.plan = plan
  }

}