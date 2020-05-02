import * as mongoose from 'mongoose'

export const AccountSchema = new mongoose.Schema({
  username: String,
  email: String,
  passwordHash: String,
  lastUpdated: Date,
  karma: Number,
  dateCreated: Date,
  favoriteRecipes: Array,
  importedRecipes: Array,
})