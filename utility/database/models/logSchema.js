import mongoose from 'mongoose';
const logSchema = new mongoose.Schema({
    logType: { type: String, required: true },//notification, message, etc
    fromUserId: { type: Number, required: true },
    toUserId: { type: Number},
    logAction: { type: String, required: true },
    logDetails: { type: String, required: true },
    logStatus: { type: String, required: true},//show to user or not
    logProblemId: { type: String},
    logAnswerId: { type: String},
});

export default mongoose.models.Log || mongoose.model('Log', logSchema);