import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import {
  Container,
  Typography,
  TextField,
  Button,
  useMediaQuery,
  IconButton,
} from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon } from '@mui/icons-material';

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

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  marginLeft: theme.spacing(1),
}));

export default function EditProblemPage() {
  const router = useRouter();
  const { problemId } = router.query;
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState('');

  const [editTitle, setEditTitle] = useState(false);
  const [editBody, setEditBody] = useState(false);
  const [editTags, setEditTags] = useState(false);

  useEffect(() => {
    if (problemId) {
      fetchData();
    }
  }, [problemId]);

  const fetchData = async () => {
    try {
      const response = await fetch(`/api/problem/${problemId}`);
      const data = await response.json();

      if (response.ok) {
        setTitle(data.title);
        setBody(data.body);
        setTags(data.tags);
      } else {
        console.error('Error fetching problem data:', data.error);
      }
    } catch (error) {
      console.error('Error fetching problem data:', error);
    }
  };

  const handleEditTitle = () => {
    setEditTitle(true);
  };

  const handleEditBody = () => {
    setEditBody(true);
  };

  const handleEditTags = () => {
    setEditTags(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const currentUserId = session.token.sub;

    try {
      const response = await fetch(`/api/problem/${problemId}`, {
        method: 'PUT',
        body: JSON.stringify({ title, body, tags }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      console.log(data); // Log the response data or handle it as needed

      // Redirect to the problem details page or any other desired location
      router.push(`/problem/${problemId}`);
    } catch (error) {
      console.error('Error updating problem:', error);
    }
  };

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <ThemeProvider theme={theme}>
      <StyledContainer maxWidth="md">
        <StyledTypography variant="h4" component="h1" align="center">
          Edit Problem
        </StyledTypography>
        <form onSubmit={handleSubmit}>
          <StyledTextField
            label="Title"
            variant="outlined"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={!editTitle}
            required
          />
          <StyledIconButton
            onClick={handleEditTitle}
            disabled={editTitle}
            color="primary"
          >
            <EditIcon />
          </StyledIconButton>
          <StyledTextField
            label="Description"
            variant="outlined"
            multiline
            rows={isMobile ? 4 : 6}
            fullWidth
            value={body}
            onChange={(e) => setBody(e.target.value)}
            disabled={!editBody}
            required
          />
          <StyledIconButton
            onClick={handleEditBody}
            disabled={editBody}
            color="primary"
          >
            <EditIcon />
          </StyledIconButton>
          <StyledTextField
            label="Tags"
            variant="outlined"
            fullWidth
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            disabled={!editTags}
            required
          />
          <StyledIconButton
            onClick={handleEditTags}
            disabled={editTags}
            color="primary"
          >
            <EditIcon />
          </StyledIconButton>
          <StyledButton
            type="submit"
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
          >
            Save
          </StyledButton>
        </form>
      </StyledContainer>
    </ThemeProvider>
  );
}
