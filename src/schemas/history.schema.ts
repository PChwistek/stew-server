import * as mongoose from 'mongoose'

export const HistorySchema = new mongoose.Schema({
  userId: String,
  history: Array,
})