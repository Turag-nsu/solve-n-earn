import connectToDatabase from '@/utility/database/databaseConnection';
import User from '@/utility/database/models/userSchema';

export default async function handler(req, res) {
  try {
    // Establish the database connection
    const dbuser = process.env.DB_USERNAME;
    const dbpass = process.env.DB_PASSWORD;
    connectToDatabase(dbuser, dbpass);

    const { method, query: { userId } } = req;

    switch (method) {
      case 'GET':
        // Get user by ID
        const getUser = await User.findOne({ id: userId });
        res.status(200).json(getUser);
        break;

      case 'PUT':
        // Update user by ID
        const { name, email, active, respectPoints } = req.body;

        // Update the user
        const updatedUser = await User.findOneAndUpdate(
          { id: userId },
          { name, email, active, respectPoints },
          { new: true }
        );

        if (!updatedUser) {
          res.status(404).json({ error: 'User not found' });
          return;
        }

        res.status(200).json(updatedUser);
        break;

      case 'DELETE':
        // Delete user by ID
        await User.findOneAndDelete({ id: userId });
        res.status(204).end();
        break;

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
