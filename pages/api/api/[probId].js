// api/api/[probId].js

import { getAllProbIds, getProblemData } from './index';

export default function handler(req, res) {
    const { probId } = req.query;
    const problem = getProblemData(probId);
  
    if (!problem) {
      res.status(404).json({ message: 'Problem not found' });
    } else {
      res.status(200).json(problem);
    }
  }
