import User from '@/utility/database/models/userSchema';
import connectToDatabase from '@/utility/database/databaseConnection';

export default async function handler(req, res) {
  try {
    const { userId } = req.query;

    // Establish the database connection
    const dbuser = process.env.DB_USERNAME;
    const dbpass = process.env.DB_PASSWORD;
    connectToDatabase(dbuser, dbpass);

    // Fetch the user by userId
    const user = await User.findOne({ id: userId }).exec();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
