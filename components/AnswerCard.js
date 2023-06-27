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
import useSWR, { useMutation } from 'swr';
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
      if (filteredNotifications.length > 0) {
        return false;
      } else {
        return true;
      }
    }
  };

  const { mutate: upvoteAnswer } = useMutation(async () => {
    try {
      const userResponse = await fetch(`/api/user/${currentUserId}`);
      const userData = await userResponse.json();
      const respectPointsToAdd = userData.user.respectPoints * 0.1;

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
      }
    } catch (error) {
      console.error('Error upvoting:', error);
    }
  });

  const handleUpvote = async () => {
    if (!session) {
      router.push('/login');
      return;
    }
    setHasUpvoted(true);
    if (canupvote(currentUserId, answer.id)) {
      upvoteAnswer();
    }
  };

  const handleDownvote = () => {
    if (hasUpvoted) {
      setUpvotes((prevUpvotes) => prevUpvotes - 1);
      setHasUpvoted(false);
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

  const handleInputChange = (e) => {
    setEditedAnswer(e.target.value);
  };

  const getAnswerActions = () => {
    if (currentUserId === answer.userId) {
      return (
        <div style={{ margin: '2rem 0 0.5rem' }}>
          {isEditing ? (
            <>
              <TextField
                multiline
                rows={2}
                fullWidth
                value={editedAnswer}
                onChange={handleInputChange}
              />
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
          <IconButton onClick={handleUpvote} disabled={hasUpvoted}>
            <ThumbUpIcon />
          </IconButton>
          <Typography variant="caption" color="text.secondary">
            {upvotes}
          </Typography>
          {/* <IconButton onClick={handleDownvote} disabled={!hasUpvoted}>
            <ThumbUpIcon color={!hasUpvoted ? 'disabled' : 'primary'} />
          </IconButton> */}
        </>
      );
    }
  };

  const getUserAvatar = () => {
    if (user && user.avatar) {
      return (
        <StyledAvatar alt={user.name} src={user.avatar} />
      );
    } else {
      return (
        <StyledAvatar alt={user.name}>
          {user && user.name.charAt(0)}
        </StyledAvatar>
      );
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <StyledCard variant="outlined">
        <StyledCardContent>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {getUserAvatar()}
            <Link href={`/profile/${answer.userId}`} passHref>
              <Typography variant="subtitle2" component="a" color="primary">
                {user ? user.name : 'Loading...'}
              </Typography>
            </Link>
          </div>
          <Typography variant="caption" color="text.secondary">
            {formatDistanceToNow(new Date(answer.createdAt), { addSuffix: true })}
          </Typography>
        </StyledCardContent>
        <StyledCardContent>{getAnswerActions()}</StyledCardContent>
      </StyledCard>
    </ThemeProvider>
  );
}
