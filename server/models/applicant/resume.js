import mongoose from 'mongoose';

const resumeSchema = mongoose.Schema({
  file: {
    type: Buffer,
    required: true
  }
});

export default mongoose.model('Resume', resumeSchema);
