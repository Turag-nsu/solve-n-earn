import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  active: { type: String, default: 'active' },
  respectPoints: { type: Number, default: 1 },
  authProvider: { type: String, required: true },
});

export default mongoose.models.User || mongoose.model('User', userSchema);
