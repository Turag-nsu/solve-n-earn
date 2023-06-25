import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import { Container, Typography, TextField, Button, useMediaQuery } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import axios from 'axios';
import useSWR, { mutate } from 'swr';

import CardComponent from '../../components/CardComponent';
import AnswerCard from '../../components/AnswerCard';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff5722',
    },
  },
});

const StyledContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  color: theme.palette.text.primary,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

export default function ProblemPage({ initialProblemData }) {
  const router = useRouter();
  const { problemId } = router.query;
  const { data: session } = useSession();
  const [answer, setAnswer] = useState('');

  const fetcher = async (url) => {
    const response = await axios.get(url);
    return response.data;
  };

  const { data: problemData, mutate: mutateProblemData } = useSWR(
    problemId ? `/api/problem/${problemId}` : null,
    fetcher,
    { initialData: initialProblemData } // Set initial data from props
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`/api/problem/${problemId}/answer`, {
        answeringUserId: session?.token?.sub,
        answerBody: answer,
      });

      if (response.status === 200) {
        console.log('Answer submitted successfully');
        mutateProblemData(); // Trigger revalidation of problem data
        setAnswer('');
      } else {
        console.error('Error submitting answer:', response.statusText);
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  const handleAnswerUpdate = async (answerId, newAnswerBody) => {
    try {
      const response = await axios.put(`/api/problem/${problemId}/answer`, {
        answerId,
        answerBody: newAnswerBody,
      });

      if (response.status === 200) {
        console.log('Answer updated successfully');
        mutate(`/api/problem/${problemId}`);
      } else {
        console.error('Error updating answer:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating answer:', error);
    }
  };

  const handleAnswerDelete = async (answerId) => {
    try {
      const response = await axios.delete(`/api/problem/${problemId}/answer`, {
        data: {
          answerId,
        },
      });

      if (response.status === 200) {
        console.log('Answer deleted successfully');
        mutate(`/api/problem/${problemId}`);
      } else {
        console.error('Error deleting answer:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting answer:', error);
    }
  };

  const createdAt = problemData ? new Date(parseInt(problemData._id.toString().substring(0, 8), 16) * 1000) : null;
  const formattedCreatedAt = createdAt ? formatDistanceToNow(createdAt, { addSuffix: true }) : null;
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <ThemeProvider theme={theme}>
      <StyledContainer maxWidth="md">
        {problemData && (
          <>
            <CardComponent
              probId={problemData.id}
              title={problemData.title}
              tags={problemData.tags}
              body={problemData.body}
              totalUpvotes={problemData.totalUpvotes}
              problemStatus={problemData.status}
              userName={problemData.userName}
              createdAt={formattedCreatedAt}
              userId={problemData.userId}
            />

            <StyledTypography variant="h6" component="h3" align="center">
              Answers
            </StyledTypography>
            {problemData.answers.map((answer) => (
              <AnswerCard
                key={answer.id}
                answer={answer}
                currentUserId={parseInt(session?.token?.sub)}
                onAnswerUpdate={handleAnswerUpdate}
                onAnswerDelete={handleAnswerDelete}
              />
            ))}

            <StyledTypography variant="h6" component="h3" align="center">
              Submit Your Answer
            </StyledTypography>
            <form onSubmit={handleSubmit}>
              <StyledTextField
                label="Answer"
                variant="outlined"
                multiline
                rows={isMobile ? 3 : 5}
                fullWidth
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
              <StyledButton type="submit" variant="contained" color="primary">
                Submit Answer
              </StyledButton>
            </form>
          </>
        )}
      </StyledContainer>
    </ThemeProvider>
  );
}


export async function getStaticPaths() {
  // Fetch the list of problem IDs from the database
  const response = await axios.get('https://solve-n-earn.vercel.app/api/problem/');
  const problemIds = response.data;

  // Generate the paths using the problem IDs
  const paths = problemIds?.map((problemId) => ({ params: { id: problemId } })); // Modify this line

  return {
    paths,
    fallback: true, // Show fallback UI while generating static pages
  };
}


export async function getStaticProps({ params }) {
  const problemId = params.problemId;

  // Fetch initial data for the problem page from the database
  const response = await axios.get(`https://solve-n-earn.vercel.app/api/problem/${problemId}`);
  const initialProblemData = response.data;
  console.log(initialProblemData);
  
  return {
    props: {
      initialProblemData,
    },
    revalidate: 10, // Revalidate the page every 10 seconds
  };
}
