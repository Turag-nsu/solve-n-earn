import React from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import Profile from '../../components/Profile';
import { useSession } from 'next-auth/react';

const fetcher = (url) => fetch(url).then((res) => res.json());

const UserProfilePage = () => {
  const router = useRouter();
  const { userId } = router.query;

  if (!userId) {
    return <div>Loading...</div>;
  }
  const { data: session } = useSession();
  const { data: user, error: userError } = useSWR(`/api/user/${userId}`, fetcher);
  const { data: problems, error: problemsError } = useSWR(`/api/problem`, fetcher);
  const userProblems = problems && problems.filter((problem) => problem.userId == userId);
  // console.log(userId, problem.userId)
  if (userError || problemsError) {
    return <div>Error fetching user data</div>;
  }

  if (!user || !problems) {
    return <div>Loading...</div>;
  }

  const { name, email, respectPoints } = user.user;

  return (
    <Profile
      name={name}
      email={email}
      respectPoints={respectPoints}
      problems={userProblems}
    />
  );
};

export default UserProfilePage;
