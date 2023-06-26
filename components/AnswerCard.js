import { useState } from 'react';
import { styled, ThemeProvider } from '@mui/material/styles';
import {
    Card,
    CardContent,
    Typography,
    CardActions,
    IconButton,
    TextField,
    Button,
    useTheme,
} from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import useSWR from 'swr';
// import canUpvoteChecker from '@/pages/api/canUpvoteChecker';
const StyledCard = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    width: '80%',
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
    paddingBottom: theme.spacing(1),
    // marginBottom: theme.spacing(1),
}));

const StyledCardActions = styled(CardActions)(({ theme }) => ({
    justifyContent: 'space-between',
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
    const [isEditing, setIsEditing] = useState(false);
    const [editedAnswer, setEditedAnswer] = useState(answer.body);
    const [upvotes, setUpvotes] = useState(answer.upvotes);
    const [hasUpvoted, setHasUpvoted] = useState(false);
    const theme = useTheme();
    const { data: user, error: userError } = useSWR(
        `/api/user/${answer.userId}`,
        fetcher,
        {
            refreshInterval: 120000,
        }
    );
    const { data: notifications, error: notificationsError } = useSWR(
        `/api/notification?userId=${currentUserId}`,
        fetcher,
        {
            refreshInterval: 120000,
        }
    );
    const canupvote = (userId, answerId) => {
        if (Array.isArray(notifications)) {
          const filteredNotifications = notifications.filter(
            (notification) =>
              notification.logType === 'notification' &&
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
        return true; // Return a default value when notifications is not an array
      };
      
    const canUpvoteChecker = () => {
        if (canupvote(currentUserId, answer.id)) {
            setHasUpvoted(true);
        } else {
            return false;
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

    const handleUpvote = () => {
        // if (canUpvoteChecker()) {
            canUpvoteChecker();
            if (!hasUpvoted) {
                setUpvotes((prevUpvotes) => prevUpvotes + 1);
                setHasUpvoted(true);
            }
        // }
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
                    <IconButton onClick={handleDownvote} disabled={!hasUpvoted}>
                        <ThumbUpIcon color={!hasUpvoted ? 'disabled' : 'primary'} />
                    </IconButton>
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
                    {user && (
                        <Typography variant="h6" color="secondary">
                            Posted by: {user.user.name}
                        </Typography>
                    )}
                    <Typography variant="body2" color="secondary">
                        {formatDistanceToNow(extractCreatedAt(answer._id), { addSuffix: true })}
                    </Typography>

                    {getAnswerActions()}
                </StyledCardContent>
            </StyledCard>
        </ThemeProvider>
    );
}