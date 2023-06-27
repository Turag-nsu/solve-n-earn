import { useState } from 'react';
import { useRouter } from 'next/router';
import { styled, ThemeProvider } from '@mui/material/styles';
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  IconButton,
  TextField,
  Button,
  Avatar,
  createTheme,
} from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { useSession } from 'next-auth/react';
import useSWR, { mutate } from 'swr';
import Link from 'next/link';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff5722',
    },
  },
});

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  width: '80%',
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  paddingBottom: theme.spacing(1),
}));

const StyledCardActions = styled(CardActions)(({ theme }) => ({
  justifyContent: 'space-between',
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  marginRight: theme.spacing(1),
  height: '30px',
  width: '10px',
}));

const fetcher = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('An error occurred while fetching the data.');
  }
  return response.json();
};

export default function AnswerCard({
  answer,
  currentUserId,
  handleDeleteAnswer,
  handleUpdateAnswer,
}) {
  const router = useRouter();
  const { problemId } = router.query;
  const [isEditing, setIsEditing] = useState(false);
  const [editedAnswer, setEditedAnswer] = useState(answer.body);
  const [upvotes, setUpvotes] = useState(answer.upvotes);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const { data: session } = useSession();
  const { data: user, error: userError } = useSWR(
    `/api/user/${answer.userId}`,
    fetcher,
    {
      refreshInterval: 120000,
    }
  );
  const { data: notificationsResponse, error: notificationsError } = useSWR(
    `/api/notification?userId=${currentUserId}&action=check`,
    fetcher,
    {
      refreshInterval: 120000,
    }
  );
  const notifications = notificationsResponse?.notifications;

  const canupvote = (userId, answerId) => {
    if (notifications) {
      const filteredNotifications = notifications?.filter(
        (notification) =>
          notification.logProblemId === problemId &&
          notification.logAction === 'upvote' &&
          notification.logAnswerId === answerId &&
          notification.fromUserId === userId
      );
      console.log(filteredNotifications);
      if (filteredNotifications.length > 0) {
        return false;
      } else {
        return true;
      }
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedAnswer(answer.body);
  };

  const handleSaveEdit = () => {
    if (editedAnswer.trim() !== answer.body) {
      handleUpdateAnswer(answer.id, editedAnswer);
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    handleDeleteAnswer(answer.id);
  };

  const handleUpvote = async () => {
    if (!session) {
      router.push('/login');
      return;
    }
    setHasUpvoted(true);
    if (canupvote(currentUserId, answer.id)) {
      try {
        const userResponse = await fetch(`/api/user/${currentUserId}`);
        const userData = await userResponse.json();

        const respectPointsToAdd = userData.user.respectPoints * 0.1;

        setHasUpvoted(true);
        setUpvotes((prevUpvotes) => prevUpvotes + 1);
        const upvoteGettingAnsId = answer.id;
        const ansUpvoteResponse = await fetch(
          `/api/problem/${problemId}/answer/${answer.id}?action=upvote`,
          {
            method: 'POST',
            body: JSON.stringify({ respectPointsToAdd, currentUserId, upvoteGettingAnsId }),
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (ansUpvoteResponse.ok) {
          const notifyLog = await fetch('/api/notification', {
            method: 'POST',
            body: JSON.stringify({
              fromUserId: currentUserId,
              fromUserName: session.token.name,
              toUserId: answer.userId,
              logType: 'notification',
              logAction: 'upvote',
              logProblemId: problemId,
              logAnswerId: answer.id,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          });
          const notifyData = await notifyLog.json();
          console.log('Notification created successfully:', notifyData);
          const upvoteData = await ansUpvoteResponse.json();
          console.log('Upvote successful:', upvoteData);

          // Update the data using mutate
          mutate(`/api/problem/${problemId}/answer/${answer.id}`);
        }
      } catch (error) {
        console.error('Error upvoting:', error);
      }
    }
  };

  const handleDownvote = () => {
    if (hasUpvoted) {
      setUpvotes((prevUpvotes) => prevUpvotes - 1);
      setHasUpvoted(false);
    }
  };

  const handleInputChange = (e) => {
    setEditedAnswer(e.target.value);
  };

  const getAnswerActions = () => {
    if (currentUserId === answer.userId) {
      return (
        <div style={{ margin: `2rem 0 0.5rem` }}>
          {isEditing ? (
            <>
              <TextField multiline rows={2} fullWidth value={editedAnswer} onChange={handleInputChange} />
              <Button onClick={handleSaveEdit} color="primary">
                Save
              </Button>
              <Button onClick={handleCancelEdit} color="secondary">
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Typography variant="body2" color="text.secondary">
                {answer.body}
              </Typography>
              <IconButton onClick={handleEdit}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={handleDelete}>
                <DeleteIcon />
              </IconButton>
            </>
          )}
        </div>
      );
    } else {
      return (
        <>
          <Typography variant="body2" color="text.secondary">
            {answer.body}
          </Typography>
          <IconButton onClick={handleUpvote} disabled={hasUpvoted && canupvote(currentUserId, answer.id) }>
            <ThumbUpIcon />
          </IconButton>
          <Typography variant="caption" color="text.secondary">
            {upvotes}
          </Typography>
        </>
      );
    }
  };

  const extractCreatedAt = (id) => {
    const timestamp = parseInt(id.substring(0, 8), 16) * 1000;
    return new Date(timestamp);
  };

  return (
    <ThemeProvider theme={theme}>
      <StyledCard>
        <StyledCardContent>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
            {user && <StyledAvatar alt={user.user.name} src={user.user.image} />}
            <Link href={`/profile/${answer.userId}`} passHref>
              <Typography
                variant="body2"
                component="a"
                sx={{ color: 'inherit', textDecoration: 'none' }}
              >
                {user ? user.user.name : 'Unknown User'}
              </Typography>
            </Link>
          </div>
          <Typography variant="body2" color="text.secondary">
            {formatDistanceToNow(extractCreatedAt(answer.id))} ago
          </Typography>
          {getAnswerActions()}
        </StyledCardContent>
      </StyledCard>
    </ThemeProvider>
  );
}
