import mongoose from 'mongoose';
import timestamps from 'mongoose-timestamp';

const companyUserSchema = mongoose.Schema({
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
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  passwordDigest: {
    type: String,
    required: true
  }
});

companyUserSchema.plugin(timestamps);

export default mongoose.model('CompanyUser', companyUserSchema);
