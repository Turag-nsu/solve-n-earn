import Question from '@/utility/database/models/questionSchema';
import User from '@/utility/database/models/userSchema';
import connectToDatabase from '@/utility/database/databaseConnection';

export default async function handler(req, res) {
  const dbuser = process.env.DB_USERNAME;
  const dbpass = process.env.DB_PASSWORD;
  await connectToDatabase(dbuser, dbpass);
  const { problemId } = req.query;
  


  if (req.method === 'GET') {
    try {
     
        // console.log(problemId);
      const problem = await Question.findOne({ id: problemId });

      if (problem) {
        res.status(200).json(problem);
      } else {
        res.status(404).json({ error: 'Problem not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'POST' && req.query.action != 'upvote') {
    try {
      const { answeringUserId, answerBody } = req.body;
      const problem = await Question.findOne({ id: problemId });
      function generateUniqueAnswerId() {
        const timestamp = Date.now().toString();
        const randomNumber = Math.floor(Math.random() * 1000).toString();
        return timestamp + randomNumber;
      }

      if (problem) {
        const answer = {
          id: generateUniqueAnswerId(),
          userId: answeringUserId,
          body: answerBody,
          upvotes: 0,
          earnings: 0,
        };

        // console.log(answer);

        problem.answers.push(answer);
        await problem.save();

        res.status(200).json({ message: 'Answer submitted successfully', answer });
      } else {
        res.status(404).json({ error: 'Problem not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
