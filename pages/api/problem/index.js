
import Question from '@/utility/database/models/questionSchema';
import connectToDatabase from '@/utility/database/databaseConnection';

export default async function handler(req, res) {
  try {
    
    const dbuser=process.env.DB_USERNAME
    const dbpass=process.env.DB_PASSWORD
    connectToDatabase(dbuser,dbpass);
    

   
    const problems = await Question.find().sort({ _id: -1 }).exec();

    res.status(200).json(problems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
