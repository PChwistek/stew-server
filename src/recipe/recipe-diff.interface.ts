import { Document } from 'mongoose'

export interface RecipeDiff extends Document {
  readonly _id: string
  readonly recipeId: string
  readonly dateModified: Date,
  readonly diff: object
}