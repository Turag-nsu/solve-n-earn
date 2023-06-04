import mongoose from 'mongoose';

const connectToDatabase = async (username, password) => {
  mongoose.set('strictQuery', false);
  const uri = `mongodb+srv://${username}:${password}@solvenearn.p6xoxpb.mongodb.net/?retryWrites=true&w=majority`;

  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.log('err could not connect to db');
  }
};

export default connectToDatabase;
