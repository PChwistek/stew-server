import { IsNotEmpty, IsNumber } from 'class-validator'

export class PurchasePlanPayload {

  readonly name: string

  @IsNumber()
  @IsNotEmpty()
  readonly numberOfSeats: number

  @IsNotEmpty()
  readonly plan: string

  constructor(name, numberOfSeats, plan) {
    this.name = name
    this.numberOfSeats = numberOfSeats
    this.plan = plan
  }

}