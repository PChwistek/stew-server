import { Document } from 'mongoose'

export interface Org extends Document {
  readonly _id: string,
  readonly members: Array<string>,
  readonly repos: Array<string>,
  readonly admins: Array<string>,
  readonly numberOfSeats: number,
  readonly paidSince: Date,
  readonly lastPaid: Date,
  readonly plan: string,
  readonly stripeCustomerId: string,
}