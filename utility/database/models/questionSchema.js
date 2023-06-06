import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  id: { type: String },
  userId: { type: Number },
  body: { type: String },
  upvotes: { type: Number, default: 0 },
  earnings: { type: Number, default: 0 },
});

const questionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: Number, required: true },
  title: { type: String, required: true },
  tags: { type: [String], required: true },
  body: { type: String, required: true },
  upvotes: { type: Number, default: 0 },
  earnings: { type: Number, default: 0 },
  problemStatus: { type: String, required: true },
  answers: [answerSchema],
  
});

export default mongoose.models.Question || mongoose.model('Question', questionSchema);
