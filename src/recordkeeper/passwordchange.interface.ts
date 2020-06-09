import { Document } from 'mongoose'

export interface PasswordChange extends Document {
  readonly _id: string
  readonly email: string,
  readonly dateRequested: Date,
  dateCompleted: Date,
  completed: boolean,
  readonly ip: string,
  readonly device: string,
  readonly completedIp: string,
  readonly completedDevice: string,
}