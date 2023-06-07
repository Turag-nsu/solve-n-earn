import Question from '@/utility/database/models/questionSchema';
import User from '@/utility/database/models/userSchema';
import connectToDatabase from '@/utility/database/databaseConnection';

export default async function handler(req, res) {
  const { method, query: { problemId } } = req;

  try {
    // Establish the database connection
    const dbuser = process.env.DB_USERNAME;
    const dbpass = process.env.DB_PASSWORD;
    await connectToDatabase(dbuser, dbpass);

    if (method === 'GET') {
      if (problemId) {
        const problem = await Question.findOne({ id: problemId });
        if (problem) {
          res.status(200).json(problem);
        } else {
          res.status(404).json({ error: 'Problem not found' });
        }
      } else {
        const problems = await Question.find();
        res.status(200).json(problems);
      }
    } else if (method === 'POST' && req.query.action === 'create') {
      const { title, body, tags } = req.body;

      const problem = new Question({
        title,
        body,
        tags,
        upvotes: 0,
        problemStatus: 'unsolved',
      });

      await problem.save();
      res.status(201).json({ message: 'Problem created successfully' });
    } else if (method === 'PUT') {
      if (problemId) {
        const { title, body, tags } = req.body;

        const problem = await Question.findOne({ id: problemId });
        if (problem) {
          problem.title = title;
          problem.body = body;
          problem.tags = tags;
          await problem.save();
          res.status(200).json({ message: 'Problem updated successfully' });
        } else {
          res.status(404).json({ error: 'Problem not found' });
        }
      } else {
        res.status(400).json({ error: 'Invalid request' });
      }
    } else if (method === 'DELETE') {
      if (problemId) {
        const problem = await Question.deleteOne({ id: problemId });
        if (problem.deletedCount > 0) {
          res.status(200).json({ message: 'Problem deleted successfully' });
        } else {
          res.status(404).json({ error: 'Problem not found' });
        }
      } else {
        res.status(400).json({ error: 'Invalid request' });
      }
    } else if (method === 'POST' && req.query.action === 'upvote') {
      const { respectPointsToAdd, userId } = req.body;

      const problem = await Question.findOne({ id: problemId });
      if (problem) {
        // Update totalUpvotes
        problem.upvotes += 1;
        await problem.save();

        // Update user's respect points
        const user = await User.findOne({ id: userId });
        if (user) {
          user.respectPoints += respectPointsToAdd;
          await user.save();
        }

        res.status(200).json({ message: 'Upvote successful' });
      } else {
        res.status(404).json({ error: 'Problem not found' });
      }
    } else if (method === 'POST' && req.query.action === 'mark-as-solved') {
      const problem = await Question.findOne({ id: problemId });
      if (problem) {
        problem.problemStatus = 'solved';
        await problem.save();
        res.status(200).json({ message: 'Problem marked as solved' });
      } else {
        res.status(404).json({ error: 'Problem not found' });
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
