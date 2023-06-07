import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import useSWR from 'swr';
import CardComponent from '../../components/CardComponent';
import AnimatedSearchBox from '@/components/AnimatedSearchBox';

function fetcher(url) {
  return fetch(url).then((res) => res.json());
}

const ProblemIndex = () => {
  const { data: problems, error } = useSWR('/api/problem', fetcher, {
    refreshInterval: 120000, 
  });

  const [problemList, setProblemList] = useState([]);

  useEffect(() => {
    if (problems) {
      const fetchUserNames = async () => {
        const updatedProblems = await Promise.all(
          problems.map(async (problem) => {
            const response = await fetch(`/api/user/${problem.userId}`);
            const { user } = await response.json();
            const { name } = await user;
            return { ...problem, userName: name };
          })
        );
        setProblemList(updatedProblems);
      };

      fetchUserNames();
    }
  }, [problems]);

  const handleUpvote = async (probId, respectPoints) => {
    const response = await fetch(`/api/problem/upvote/${probId}`, {
      method: 'POST',
    });
    if (response.ok) {
      const updatedProblemList = problemList.map((problem) => {
        if (problem.probId === probId) {
          return {
            ...problem,
            upvotes: problem.upvotes + 1,
            respectPoints: problem.respectPoints + respectPoints * 0.1,
          };
        }
        return problem;
      });
      setProblemList(updatedProblemList);
    }
  };

  if (!problems) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching problems</div>;
  }

  return (
    <div>
      <AnimatedSearchBox />
      {problemList.map((problem) => {
        const createdAt = new Date(parseInt(problem._id.toString().substring(0, 8), 16) * 1000);
        const formattedCreatedAt = formatDistanceToNow(createdAt, { addSuffix: true });

        return (
          problem.problemStatus === 'unsolved' && (
            <CardComponent
              key={problem.id}
              probId={problem.id}
              title={problem.title}
              type={problem.type}
              tags={problem.tags}
              body={problem.body}
              totalUpvotes={problem.upvotes}
              userName={problem.userName || 'Unknown User'}
              createdAt={formattedCreatedAt}
              userId={problem.userId}
              onUpvote={() => handleUpvote(problem.probId, problem.respectPoints)}
            />
          )
        );
      })}
    </div>
  );
};

export default ProblemIndex;
