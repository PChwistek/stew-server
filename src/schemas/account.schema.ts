import * as mongoose from 'mongoose'

export const AccountSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  karma: Number,
  dateCreated: Date,
  favoriteRecipes: Array,
})