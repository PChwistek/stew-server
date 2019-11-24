import * as mongoose from 'mongoose'

export const AccountSchema = new mongoose.Schema({
  purchasedSeats: Number,
  ownedTeams: Array,
  teamMembers: Array,
  validUntil: Date,
})