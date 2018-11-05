import mongoose from 'mongoose';
import timestamps from 'mongoose-timestamp';

import questionSchema from './sub-schema/question';

const screeningSchema = mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  questions: {
    type: [questionSchema],
    required: true
  },
  visits: Number
});

export default mongoose.model('Screening', screeningSchema);
