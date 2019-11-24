import * as mongoose from 'mongoose'

export const RecipeSchema = new mongoose.Schema({
  title: String,
  createdBy: String,
  private: Boolean,
  groupId: String,
  tabs: Object,
  timesLaunched: Number,
  favorited: Number,
})