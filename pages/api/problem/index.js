
import Question from '@/utility/database/models/questionSchema';
import connectToDatabase from '@/utility/database/databaseConnection';

export default async function handler(req, res) {
  try {
    // Establish the database connection
    const dbuser=process.env.DB_USERNAME
    const dbpass=process.env.DB_PASSWORD
    connectToDatabase(dbuser,dbpass);
    

    // Fetch the problems from the database
    const problems = await Question.find().sort({ time: 1 }).exec();

    res.status(200).json(problems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
