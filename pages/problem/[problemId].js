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

export default function ProblemPage() {
  const router = useRouter();
  const { problemId } = router.query;
  const { data: session } = useSession();
  const [problem, setProblem] = useState(null);
  const [answer, setAnswer] = useState('');

  const fetchProblemDetails = async () => {
    try {
      const response = await fetch(`/api/problem/${problemId}`);
      if (response.ok) {
        const problemData = await response.json();
        setProblem(problemData);
      } else {
        console.error('Error fetching problem details:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching problem details:', error);
    }
  };

  useEffect(() => {
    if (problemId) {
      fetchProblemDetails();
    }
  }, [problemId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const requestBody = {
      answeringUserId: session?.token?.sub,
      answerBody: answer,
    };

    try {
      const response = await fetch(`/api/problem/${problemId}/answer`, {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        console.log('Answer submitted successfully');
        fetchProblemDetails();
      } else {
        console.error('Error submitting answer:', response.statusText);
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <ThemeProvider theme={theme}>
      <StyledContainer maxWidth="md">
        {problem ? (
          <>
            <StyledTypography variant="h4" component="h1" align="center">
              Problem Details
            </StyledTypography>
            <StyledTypography variant="h5" component="h2" align="center">
              Problem ID: {problem.id}
            </StyledTypography>
            <StyledTypography variant="h6" component="h3" align="center">
              {problem.title}
            </StyledTypography>
            <StyledTypography variant="body1" align="center">
              {problem.body}
            </StyledTypography>
            <StyledTypography variant="body2" align="center">
              Tags: {problem.tags.join(', ')}
            </StyledTypography>

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
