import connectToDatabase from '@/utility/database/databaseConnection';
import UserSchema from '@/utility/database/models/userSchema';
import Question from '@/utility/database/models/questionSchema';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Retrieve the problem data from the request body
    const { title, tags, body, email } = req.body;

    try {
      // Establish the database connection
      const dbuser = process.env.DB_USERNAME;
      const dbpass = process.env.DB_PASSWORD;
      await connectToDatabase(dbuser, dbpass);

      // Find the user in the database using the email
      const user = await UserSchema.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const unsolved = "unsolved";
      const newQuestion = new Question({
        id: Math.floor(Math.random() * 100000),
        userId: user.id,
        title,
        tags: tags.split(',').map((tag) => tag.trim()),
        body,
        answers: [], // Default value for the "answers" field
        upvotes: 0, // Default value for the "upvotes" field
        earnings: 0, // Default value for the "earnings" field
        problemStatus: unsolved, // Default value for the "status" field
      });

      await newQuestion.save();

      res.status(200).json({ message: 'Problem posted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error posting problem' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
