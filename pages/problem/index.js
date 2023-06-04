import useSWR from 'swr';
import { useEffect, useState } from 'react';
import CardComponent from '../../components/CardComponent';
import { formatDistanceToNow } from 'date-fns';
import AnimatedSearchBox from '@/components/AnimatedSearchBox';

function fetcher(url) {
  return fetch(url).then((res) => res.json());
}

const ProblemIndex = () => {
  const { data: problems, error } = useSWR('/api/problem', fetcher, {
    refreshInterval: 120000, // Refresh every 2 minutes
  });

  const [problemList, setProblemList] = useState([]);

  useEffect(() => {
    if (problems) {
      const fetchUserNames = async () => {
        const updatedProblems = await Promise.all(
          problems.map(async (problem) => {
            const response = await fetch(`/api/user/${problem.userId}`);
            const { name } = await response.json();
            return { ...problem, userName: name };
          })
        );
        setProblemList(updatedProblems);
      };

      fetchUserNames();
    }
  }, [problems]);

  if (!problems) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching problems</div>;
  }

  return (
    <div>
      <AnimatedSearchBox/>
      {problemList.map((problem) => {
        const createdAt = new Date(parseInt(problem._id.toString().substring(0, 8), 16) * 1000);
        const formattedCreatedAt = formatDistanceToNow(createdAt, { addSuffix: true });

        return (
          (problem.problemStatus === 'unsolved' && (
            <CardComponent
              key={problem.id}
              probId={problem.id}
              title={problem.title}
              type={problem.type}
              tags={problem.tags}
              body={problem.body}
              totalUpvotes={problem.totalUpvotes}
              userName={problem.userName || 'Unknown User'}
              createdAt={formattedCreatedAt}
              userId={problem.userId}
            />
          ))
        );
      })}
    </div>
  );
};

export default ProblemIndex;
