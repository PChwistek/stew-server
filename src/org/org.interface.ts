import { Document } from 'mongoose'

export interface Member {
  email: string,
  status: string,
}

export interface Org extends Document {
  readonly _id: string,
  members: Array<Member>,
  repos: Array<string>,
  admins: Array<string>,
  numberOfSeats: number,
  readonly paidSince: Date,
  lastPaid: Date,
  plan: string,
  readonly stripeCustomerId: string,
}