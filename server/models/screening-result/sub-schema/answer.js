import mongoose from 'mongoose';

// this should map perfectly parallel to 'questionSchema'
export default mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  answerType: {
    type: String,
    enum: ['MULTIPLE_CHOICE', 'OPEN_RESPONSE'],
    required: true
  },
  body: {
    type: String,
    required: true
  }
});
