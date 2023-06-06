import User from '@/utility/database/models/userSchema';
import connectToDatabase from '@/utility/database/databaseConnection';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { name } = req.query;

      // Establish the database connection
      const dbuser = process.env.DB_USERNAME;
      const dbpass = process.env.DB_PASSWORD;
      await connectToDatabase(dbuser, dbpass);

      if (name) {
        // Search users by name
        const users = await User.find({ name: { $regex: name, $options: 'i' } });
        res.status(200).json(users);
      } else {
        // Fetch all users
        const users = await User.find();
        res.status(200).json(users);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server Error' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.body;

      // Delete the user by ID
      await User.deleteOne({ id });

      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server Error' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { id, name, email } = req.body;

      // Find the user by ID and update the name and email
      await User.findOneAndUpdate({ id }, { name, email });

      res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server Error' });
    }
  } else {
    res.status(400).json({ error: 'Invalid Request Method' });
  }
}
