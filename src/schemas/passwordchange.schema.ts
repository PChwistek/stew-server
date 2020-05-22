import * as mongoose from 'mongoose'

export const PasswordChangeSchema = new mongoose.Schema({
  email: String,
  dateRequested: Date,
  dateCompleted: Date,
  completed: Boolean,
  ip: String,
  device: String,
  completedIp: String,
  completedDevice: String,
})