import mongoose from 'mongoose';
import timestamps from 'mongoose-timestamp';

// child schema
// import experienceSchema from './sub-schema/experience';
// import educationSchema from './sub-schema/education';
import questionSchema from '../screening/sub-schema/question';

const applicantSchema = mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  jobId: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['NOT_VERIFIED', 'VERIFIED', 'BEGUN_EXAM', 'COMPLETE'],
    required: true
  },
  exam: {
    type: [questionSchema],
    required: true
  },
  testTimestamp: Number
});

applicantSchema.plugin(timestamps);

export default mongoose.model('Applicant', applicantSchema);
