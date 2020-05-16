import * as mongoose from 'mongoose'

export const OrgSchema = new mongoose.Schema({
  org: String,
  members: Array,
  repos: Array,
  admins: Array,
  numberOfSeats: Number,
  paidSince: Date,
  lastPaid: Date,
  plan: String,
})