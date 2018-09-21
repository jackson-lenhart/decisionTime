import mongoose from 'mongoose';
import timestamps from 'mongoose-timestamp';

// child schema
import experienceSchema from './schemas/experience';
import educationSchema from './schemas/education';

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
  felonForm: String
});

applicantSchema.plugin(timestamps);

export default mongoose.model('Applicant', applicantSchema);
