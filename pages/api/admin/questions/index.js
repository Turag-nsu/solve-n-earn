import Question from '@/utility/database/models/questionSchema';
import connectToDatabase from '@/utility/database/databaseConnection';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { title } = req.query;

      // Establish the database connection
      const dbuser = process.env.DB_USERNAME;
      const dbpass = process.env.DB_PASSWORD;
      await connectToDatabase(dbuser, dbpass);

      if (title) {
        // Search questions by title
        const questions = await Question.find({ title: { $regex: title, $options: 'i' } });
        res.status(200).json(questions);
      } else {
        // Fetch all questions
        const questions = await Question.find();
        res.status(200).json(questions);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server Error' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.body;

      // Delete the question by ID
      await Question.deleteOne({ id });

      res.status(200).json({ message: 'Question deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server Error' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { id, title } = req.body;

      // Find the question by ID and update the title
      await Question.findOneAndUpdate({ id }, { title });

      res.status(200).json({ message: 'Question updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server Error' });
    }
  } else {
    res.status(400).json({ error: 'Invalid Request Method' });
  }
}
