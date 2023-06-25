import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import { Container, Typography, TextField, Button, useMediaQuery } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
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

  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data: problemData, mutate: mutateProblemData } = useSWR(
    problemId ? `/api/problem/${problemId}` : null,
    fetcher,
    { initialData: initialProblemData } // Set initial data from props
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/problem/${problemId}/answer`, {
        method: 'POST',
        body: JSON.stringify({
          answeringUserId: session?.token?.sub,
          answerBody: answer,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
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
      const response = await fetch(`/api/problem/${problemId}/answer`, {
        method: 'PUT',
        body: JSON.stringify({
          answerId,
          answerBody: newAnswerBody,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
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
      const response = await fetch(`/api/problem/${problemId}/answer`, {
        method: 'DELETE',
        body: JSON.stringify({
          answerId,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
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
        {problemData ? (
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
        ) : (
          <StyledTypography variant="h6" align="center">
            Loading problem details...
          </StyledTypography>
        )}
      </StyledContainer>
    </ThemeProvider>
  );
}

export async function getStaticPaths() {
  // Fetch the list of problem IDs from the database
  const problemIds = await fetch('https://solve-n-earn.vercel.app/api/problem/').then((res) => res.json());

  // Generate the paths using the problem IDs
  const paths = problemIds?.map((id) => ({ params: { problemId: id.toString() } }));

  return {
    paths,
    fallback: true, // Show fallback UI while generating static pages
  };
}

export async function getStaticProps({ params }) {
  const problemId = params.problemId;

  // Fetch initial data for the problem page from the database
  const initialProblemData = await fetch(`https://solve-n-earn.vercel.app/api/problem/${problemId}`).then((res) => res.json());

  return {
    props: {
      initialProblemData,
    },
    revalidate: 1, // Revalidate the page every 1 second
  };
}
