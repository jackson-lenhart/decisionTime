import mongoose from 'mongoose';
import timestamps from 'mongoose-timestamp';

import answerSchema from './sub-schema/answer';
import questionSchema from '../screening/sub-schema/question';

// this should probably have a companyId eventually too
const screeningResultSchema = mongoose.Schema({
  applicantId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  answers: {
    type: [answerSchema],
    required: true
  },
  questions: {
    type: [questionSchema],
    required: true
  },
  secondsElapsed: {
    type: Number,
    required: true
  }
});

screeningResultSchema.plugin(timestamps);

export default mongoose.model('ScreeningResult', screeningResultSchema);
