import { Document } from 'mongoose'

export interface OrgInvite extends Document {
  readonly _id: string
  readonly orgId: string
  readonly adminId: string,
  readonly memberEmail: string,
  readonly memberId: string,
  readonly dateRequested: Date,
  dateCompleted: Date,
  completed: boolean,
}