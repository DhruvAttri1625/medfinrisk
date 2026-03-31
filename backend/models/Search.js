import mongoose from 'mongoose';

const searchSchema = new mongoose.Schema({
  mode: String,

  treatment: String,
  city: String,
  hospitalId: String,

  income: Number,
  emi: Number,
  expenses: Number,
  dependents: Number,

  insurer: String,
  coverage: Number,
  copay: Boolean,
  pmjay: Boolean,

  totalCost: Number,
  outOfPocket: Number,
  riskScore: Number,

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Search', searchSchema); 