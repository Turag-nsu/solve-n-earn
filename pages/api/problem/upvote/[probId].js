import Question from '@/utility/database/models/questionSchema';
import User from '@/utility/database/models/userSchema';
import connectToDatabase from '@/utility/database/databaseConnection';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { probId } = req.query;
    const id = parseInt(probId);
    try {
      // Establish the database connection
      const dbuser = process.env.DB_USERNAME;
      const dbpass = process.env.DB_PASSWORD;
      await connectToDatabase(dbuser, dbpass);
      const { respectPointsToAdd, userId } = req.body;

      // Find the problem by its id and increment the totalUpvotes field
      
      const user = await User.findOne({ id: userId });
      if(user){
        user.respectPoints += respectPointsToAdd;
        await user.save();
        res.status(200).json({ respectPoints: user.respectPoints });
      }else {
        res.status(404).json({ error: 'user not found' });
      }
      const problem = await Question.findOne({ id });
      if (problem) {
        problem.upvotes += 1;
        await problem.save();
        res.status(200).json({ upvotes: problem.upvotes });
      } else {
        res.status(404).json({ error: 'Problem not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server Error' });
    }
  } else {
    res.status(400).json({ error: 'Invalid Request Method' });
  }
}
