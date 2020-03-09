import { Document } from 'mongoose'
import { WindowConfig } from './windowConfig.interface'

export interface Recipe extends Document {
  readonly _id: string
  readonly __v: number
  readonly name: string
  readonly author: string
  readonly dateCreated: Date
  readonly dateModified: Date
  readonly tags: Array<string>
  readonly attributes: Array<string>
  readonly config: Array<WindowConfig>
}

export interface RecipeHistory extends Document {
  readonly _id: string
  readonly _recipeV: number
  readonly recipeId: string
  readonly dateCreated: Date
  readonly dateModified: Date
  readonly name: string
  readonly author: string
  readonly tags: Array<string>
  readonly attributes: Array<string>
  readonly config: Array<WindowConfig>
}