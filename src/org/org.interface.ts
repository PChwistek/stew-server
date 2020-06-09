import { Document } from 'mongoose'

export interface Org extends Document {
  readonly _id: string,
  readonly name: string,
  members: Array<Member>,
  repos: Array<Repo>,
  admins: Array<string>,
  numberOfSeats: number,
  readonly paidSince: Date,
  validUntil: Date,
  plan: string,
  readonly stripeCustomerId: string,
  readonly settings: Settings,
}

export interface Repo {
  readonly repoId: string,
  readonly name: string,
  readonly recipes: Array<string>,
  readonly permittedUsers: Array<string>,
}

export interface Member {
  email: string,
  status: string,
}

export interface Settings {

}