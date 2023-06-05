import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import {
  Container,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Box,
  createTheme,
  ThemeProvider,
} from '@mui/material';
import Link from 'next/link';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff5722',
    },
  },
});

const PostProblem = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [body, setBody] = useState('');
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const probStatus = 'unsolved';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const email = await session.user.email;

    if (!session || !session.user) {
      console.log('User is not logged in');
      return;
    }

    try {
      const response = await fetch('/api/problem/postProblem', {
        method: 'POST',
        body: JSON.stringify({ title, tags, body, email, probStatus }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        router.push('/problem');
      } else {
        console.log('Error posting problem:', response.status);
      }
    } catch (error) {
      console.log('Error posting problem:', error);
    }

    setIsLoading(false);
  };

  if (status === 'loading') {
    return (
      <Container maxWidth="md">
        <Typography variant="h4" align="center" style={{ marginTop: '70px', margin: 'auto' }} gutterBottom>
          Loading...
        </Typography>
      </Container>
    );
  }

  if (!session) {
    return (
      <Container maxWidth="md" style={{ marginTop: '70px', marginBottom: '70px', padding: '16px' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Please <Link href="/login"><span style={{ color: '#ff5722' }}>log in</span></Link> to post a problem.
        </Typography>
      </Container>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md">
        <Typography variant="h4" align="center" gutterBottom>
          Post a Problem
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: '24px',
          }}
        >
          <TextField
            label="Title"
            fullWidth
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
            variant="outlined"
            color="primary"
          />
          <TextField
            label="Tags (comma-separated)"
            fullWidth
            required
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            margin="normal"
            variant="outlined"
            color="primary"
          />
          <TextField
            label="Body"
            fullWidth
            required
            multiline
            rows={4}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            margin="normal"
            variant="outlined"
            color="primary"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
            sx={{ marginTop: '16px' }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Post Problem'}
          </Button>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default PostProblem;
