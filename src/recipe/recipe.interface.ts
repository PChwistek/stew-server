import { Document } from 'mongoose'
import { WindowConfig } from './windowConfig.interface'

export interface Recipe extends Document {
  readonly _id: string
  readonly name: string
  readonly author: string
  readonly tags: Array<string>
  readonly attributes: Array<string>
  readonly config: Array<WindowConfig>
}