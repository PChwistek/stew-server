import { Document } from 'mongoose'

export interface Account extends Document {
  readonly email: string
  readonly passwordHash: string
  readonly karma: number
  readonly dateCreated: Date
  readonly favoriteRecipes: Array<string>
}