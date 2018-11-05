import mongoose from 'mongoose';

export default mongoose.Schema({
  body: {
    type: String,
    required: true
  },
  correct: Boolean
});
