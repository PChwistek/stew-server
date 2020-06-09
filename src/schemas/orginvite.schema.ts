import * as mongoose from 'mongoose'

export const OrgInviteSchema = new mongoose.Schema({
  orgId: String,
  adminId: String,
  memberEmail: String,
  memberId: String,
  dateRequested: Date,
  dateCompleted: Date,
  completed: Boolean,
})