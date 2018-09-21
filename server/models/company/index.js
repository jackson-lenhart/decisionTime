import mongoose from 'mongoose';
import timestamps from 'mongoose-timestamp';

const companySchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  accessToken: {
    type: String,
    required: true
  }
});

companySchema.plugin(timestamps);

export default mongoose.model('Company', companySchema);
