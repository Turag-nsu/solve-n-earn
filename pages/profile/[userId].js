import { useRouter } from 'next/router';
import useSWR from 'swr';
import Profile from '../../components/Profile';
import { useSession, getSession } from 'next-auth/react';
// import { Typography } from '@mui/material';

const fetcher = (url) => fetch(url).then((res) => res.json());

const UserProfilePage = ({ initialData }) => {
  const router = useRouter();
  const { userId } = router.query;

  // if (!userId) {
  //   return <div>Loading...</div>;
  // }
  
  const { data: session } = useSession();
  const { data: user, error: userError } = useSWR(`/api/user/${userId}`, fetcher, {
    initialData: initialData.user,
  });
  const { data: problems, error: problemsError } = useSWR(`/api/problem`, fetcher, {
    initialData: initialData.problems,
  });
  const userProblems = problems && problems.filter((problem) => problem.userId == userId);

  // if (userError || problemsError) {
  //   return <div>Error fetching user data</div>;
  // }

  // if (!user || !problems) {
  //   return <Typography>Loading...</Typography>;
  // }

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

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const { userId } = context.params;
  const userResponse = await fetch(`https://solve-n-earn.vercel.app/api/user/${userId}`);
  const problemsResponse = await fetch(`https://solve-n-earn.vercel.app/api/problem`);
  
  if (!userResponse.ok || !problemsResponse.ok) {
    return {
      notFound: true,
    };
  }

  const userData = await userResponse.json();
  const problemsData = await problemsResponse.json();

  return {
    props: {
      initialData: {
        user: userData,
        problems: problemsData,
      },
    },
  };
}

export default UserProfilePage;
