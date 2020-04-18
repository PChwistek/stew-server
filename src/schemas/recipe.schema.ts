import * as mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

export const RecipeSchema = new mongoose.Schema({
  name: String,
  author: String,
  authorId: String,
  forkedFromId: String,
  tags: Object,
  attributes: Array,
  config: Array,
  dateCreated: Date,
  dateModified: Date,
  shareableId: { type: String, default: uuidv4() },
  permissions: Array,
})

export const RecipeHistorySchema = new mongoose.Schema({
  recipeId: String,
  name: String,
  author: String,
  authorId: String,
  forkedFromId: String,
  tags: Object,
  attributes: Array,
  config: Array,
  dateCreated: Date,
  dateModified: Date,
  _recipeV: Number,
  shareableId: String,
  permissions: Array,
})