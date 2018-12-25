import mongoose from 'mongoose';
import timestamps from 'mongoose-timestamp';

const visitSchema = mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

visitSchema.plugin(timestamps);

export default mongoose.model('Visit', visitSchema);
