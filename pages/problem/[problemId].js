import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import {
  Container,
  Typography,
  TextField,
  Button,
  useMediaQuery,
} from '@mui/material';
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

export default function ProblemPage({ problemData }) {
  const router = useRouter();
  const { problemId } = router.query;
  const { data: session } = useSession();
  const [answer, setAnswer] = useState('');

  const fetchProblemDetails = async () => {
    try {
      const response = await fetch(`/api/problem/${problemId}`);
      if (response.ok) {
        const problemData = await response.json();
        mutate(`/api/problem/${problemId}`, problemData);
      } else {
        console.error('Error fetching problem details:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching problem details:', error);
    }
  };

  useEffect(() => {
    fetchProblemDetails();
  }, [problemId]);

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
        mutate(`/api/problem/${problemId}`);
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

  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data: user, error: problemError } = useSWR(
    problemId ? `/api/user/${problemData.userId}` : null,
    fetcher
  );

  const createdAt = new Date(parseInt(problemData._id.toString().substring(0, 8), 16) * 1000);
  const formattedCreatedAt = formatDistanceToNow(createdAt, { addSuffix: true });
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const problem = problemData;
    // console.log(problem);
  return (
    <ThemeProvider theme={theme}>
      <StyledContainer maxWidth="md">
        {problemData ? (
          <>
            <CardComponent
              probId={problem.id}
              title={problem.title}
              tags={problem.tags}
              body={problem.body}
              totalUpvotes={problem.totalUpvotes}
              problemStatus={problem.status}
              userName={user?.user?.name}
              createdAt={formattedCreatedAt}
              userId={problem.userId}
            />

            <StyledTypography variant="h6" component="h3" align="center">
              Answers
            </StyledTypography>
            {problem.answers.map((answer) => (
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

export async function getServerSideProps({ params }) {
  const { problemId } = params;
  const problemResponse = await fetch(`https://solve-n-earn.vercel.app//api/problem/${problemId}`);

  if (!problemResponse.ok) {
    return {
      notFound: true,
    };
  }

  const problemData = await problemResponse.json();

  return {
    props: {
      problemData,
    },
  };
}
