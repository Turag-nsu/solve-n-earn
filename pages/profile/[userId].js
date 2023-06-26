import { useRouter } from 'next/router';
import useSWR, { mutate } from 'swr';
import Profile from '../../components/Profile';
import { Typography } from '@mui/material';

const fetcher = (url) => fetch(url).then((res) => res.json());

const UserProfilePage = ({ initialData }) => {
  const router = useRouter();
  const { userId } = router.query;
  const { data: userData, error: userError } = useSWR(`/api/user/${userId}`, fetcher, {
    initialData: initialData.user,
  });
  const user = userData?.user;

  const { data: problems, error: problemsError } = useSWR(`/api/problem`, fetcher, {
    initialData: initialData.problems,
  });
  const userProblems = problems && problems.filter((problem) => problem.userId == userId);

  const handleProblemDelete = async (problemId) => {
    try {
      mutate(`/api/user/${userId}`); // Trigger revalidation of user data
      mutate('/api/problem'); // Trigger revalidation of problem data

    } catch (error) {
      console.error('Error deleting problem:', error);
    }
  };
  
  if (userError || problemsError) {
    return <Typography>Error fetching user data. Please try again later or contact our developer team.</Typography>;
  }

  return (
    <Profile
      name={user?.name}
      email={user?.email}
      respectPoints={user?.respectPoints}
      problems={userProblems}
      onDeleteProblem={handleProblemDelete}
    />
  );
};

export async function getStaticPaths() {
  const usersResponse = await fetch('https://solve-n-earn.vercel.app/api/user');
  const usersData = await usersResponse.json();

  const paths = usersData?.map((user) => ({
    params: { userId: user.id.toString() },
  }));
  // console.log(paths);
  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps(context) {
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
  // console.log(problemsData, userData);
  return {
    props: {
      initialData: {
        userData,      // Update property name to 'userData'
        problemsData,  // Update property name to 'problemsData'
      },
    },
  };
}

export default UserProfilePage;
