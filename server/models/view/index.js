import mongoose from 'mongoose';
import timestamps from 'mongoose-timestamp';

const viewSchema = mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  jobTitle: {
    type: String,
    required: true
  }
});

viewSchema.plugin(timestamps);

export default mongoose.model('View', viewSchema);
