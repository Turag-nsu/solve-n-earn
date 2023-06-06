import connectToDatabase from '@/utility/database/databaseConnection';
import Question from '@/utility/database/models/questionSchema';

export default async function handler(req, res) {
  try {
    // Establish the database connection
    const dbuser = process.env.DB_USERNAME;
    const dbpass = process.env.DB_PASSWORD;
    connectToDatabase(dbuser, dbpass);

    const { method, query: { questionId } } = req;

    switch (method) {
      case 'GET':
        // Get question by ID
        const getQuestion = await Question.findOne({ id: questionId });
        res.status(200).json(getQuestion);
        break;

      case 'PUT':
        // Update question by ID
        const { title, content, category } = req.body;

        // Update the question
        const updatedQuestion = await Question.findOneAndUpdate(
          { id: questionId },
          { title, content, category },
          { new: true }
        );

        if (!updatedQuestion) {
          res.status(404).json({ error: 'Question not found' });
          return;
        }

        res.status(200).json(updatedQuestion);
        break;

      case 'DELETE':
        // Delete question by ID
        await Question.findOneAndDelete({ id: questionId });
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
