import { Document } from 'mongoose'

export interface Account extends Document {
  readonly _id: string
  readonly email: string
  readonly username: string
  readonly passwordHash: string
  readonly karma: number
  readonly dateCreated: Date
  orgs: Array<string>,
  lastUpdated: Date
  favoriteRecipes: Array<string>
  importedRecipes: Array<string>
}