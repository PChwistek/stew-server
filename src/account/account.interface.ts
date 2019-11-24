import { Document } from 'mongoose'

export interface Account extends Document {
  readonly username: string
  readonly email: string
  readonly password: string
  readonly karma: number
  readonly dateCreated: Date
  readonly favoriteRecipes: Array<string>
}