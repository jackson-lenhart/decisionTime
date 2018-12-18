import mongoose from 'mongoose';
import timestamps from 'mongoose-timestamp';

// child schema
import experienceSchema from './sub-schema/experience';
import educationSchema from './sub-schema/education';
import questionSchema from '../screening/sub-schema/question';

const applicantSchema = mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  jobId: {
    type: String,
    required: true
  },
  jobTitle: {
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
    enum: ['INITIALIZED', 'BEGUN_EXAM', 'COMPLETE'],
    required: true
  },
  exam: {
    type: [questionSchema],
    required: true
  },
  address: String,
  city: String,
  state: String,
  zipCode: String,
  phone: String,
  experience: [experienceSchema],
  education: [educationSchema],
  resumeUploaded: Boolean,
  coverLetter: String,
  salaryRequirements: String,
  isOver18: Boolean,
  isLegal: Boolean,
  isFelon: Boolean,
  felonForm: String,
  testTimestamp: Number
});

applicantSchema.plugin(timestamps);

export default mongoose.model('Applicant', applicantSchema);
