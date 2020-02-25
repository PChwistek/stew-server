import * as mongoose from 'mongoose'
import { WindowConfig } from '../recipe/windowConfig.interface'

export const RecipeSchema = new mongoose.Schema({
  name: String,
  author: String,
  authorId: String,
  tags: Object,
  attributes: Array,
  config: Array,
})