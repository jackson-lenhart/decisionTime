import mongoose from 'mongoose';

export default mongoose.Schema({
  schoolName: String,
  major: String,
  isCurrent: Boolean,
  isFinished: Boolean,
  startDate: Date,
  endDate: Date,
  degree: String,
  description: String
});
