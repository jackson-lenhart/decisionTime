import mongoose from 'mongoose';

import optionSchema from './option';

export default mongoose.Schema({
  questionType: {
    type: String,
    enum: ['MULTIPLE_CHOICE', 'OPEN_RESPONSE'],
    required: true
  },
  body: {
    type: String,
    required: true
  },
  options: [optionSchema]
});
