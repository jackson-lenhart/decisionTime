import mongoose from 'mongoose';
import timestamps from 'mongoose-timestamp';

const jobSchema = mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  visits: Number
});

jobSchema.plugin(timestamps);

export default mongoose.model('Job', jobSchema);
