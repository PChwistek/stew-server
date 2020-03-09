import * as mongoose from 'mongoose'

export const RecipeSchema = new mongoose.Schema({
  name: String,
  author: String,
  authorId: String,
  tags: Object,
  attributes: Array,
  config: Array,
  dateCreated: Date,
  dateModified: Date,
})

export const RecipeHistorySchema = new mongoose.Schema({
  recipeId: String,
  name: String,
  author: String,
  authorId: String,
  tags: Object,
  attributes: Array,
  config: Array,
  dateCreated: Date,
  dateModified: Date,
  _recipeV: Number,
})