import mongoose from 'mongoose';

export default mongoose.Schema({
  companyName: String,
  jobTitle: String,
  isCurrentJob: Boolean,
  startDate: Date,
  endDate: Date,
  jobDescription: String,
  reasonForLeaving: String
});
