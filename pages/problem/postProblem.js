import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import {
  Container,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from '@mui/material';
import Link from 'next/link';

const PostProblem = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [body, setBody] = useState('');
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
    const probStatus = "unsolved";
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const email = await session.user.email;
    if (!session || !session.user) {
      // Handle the case where the user is not logged in or session is undefined
      // You can redirect the user to the login page or show a login prompt
      console.log('User is not logged in');
      return;
    }
  
    // Perform API request to post the problem
    // Replace this with your actual API endpoint and logic
    try {
        const response = await fetch('/api/problem/postProblem', {
            method: 'POST',
            body: JSON.stringify({ title, tags, body, email, probStatus}),
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
    // Redirect or show login prompt
    return (
      <Container maxWidth="md" style={{ marginTop: '70px',marginBottom: '70px', padding: '16px' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Please <Link href="/login"><span style={{ color: '#ff5722' }}>log in</span></Link> to post a problem.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom>
        Post a Problem
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          fullWidth
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
          variant="outlined"
        />
        <TextField
          label="Tags (comma-separated)"
          fullWidth
          required
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          margin="normal"
          variant="outlined"
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
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isLoading}
          style={{ marginTop: '16px' }}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Post Problem'}
        </Button>
      </form>
    </Container>
  );
};

export default PostProblem;
