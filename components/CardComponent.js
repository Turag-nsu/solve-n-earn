import { useState } from 'react';
import { Card, CardContent, CardHeader, Typography, Button, Box, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import Link from 'next/link';
// import canUpvoteChecker from '@/pages/api/canUpvoteChecker';

const StyledCard = styled(Card)(({ theme }) => ({
  margin: theme.spacing(2),
  boxShadow: theme.boxShadow,
}));

const TypeTagWrapper = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  marginBottom: '0.5rem',
});

const Tag = styled(Typography)(({ theme }) => ({
  marginRight: theme.spacing(1),
  marginBottom: theme.spacing(1),
  color: theme.palette.secondary.main,
  fontWeight: 600,
}));

const Body = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const TotalUpvotesWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '1rem',
});

const UpvoteCount = styled(Typography)(({ theme }) => ({
  marginRight: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

const UpvoteLogo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0.5),
  height: theme.spacing(3),
  backgroundColor: 'rgba(27, 255, 30, 0.41)',
  border: `1px solid ${theme.palette.primary.main}`,
  color: theme.palette.text.secondary,
  fontWeight: 600,
  marginLeft: theme.spacing(1),
  // background: `radial-gradient(circle at center, #ff5722, #32cd32)`,
  boxShadow: '0px 0px 8px #32cd32',
}));

const CenteredCardContainer = styled(Box)({
  width: '90%',
  margin: 'auto',
});

const ActionButton = styled(Button)(({ theme }) => ({
  marginRight: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

function CardComponent(props) {

  const { probId, title, tags, body, totalUpvotes, problemStatus, userName, createdAt, userId } = props;
  const router = useRouter();
  const postingUser = () =>{
    if (session && currentUserId === userId) {
      return `You`;
    } else {
      return userName;
    }
  }
  const { data: session } = useSession();
  const currentUserId = parseInt(session?.token?.sub)
  const [isUpvoted, setIsUpvoted] = useState(false); 
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const handleOnMarkAsSolved = async () => {
    try {
      const response = await fetch(`/api/problem/${probId}?action=mark-as-solved`, {
        method: 'POST',
        body: JSON.stringify({ currentUserId }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const notifyLog = await fetch('/api/notification', {
          method: 'POST',
          body: JSON.stringify({
            fromUserId: currentUserId,
            fromUserName: session.token.name,
            toUserId: parseInt(userId),
            logType: 'notification',
            logAction: 'solved',
            logProblemId: parseInt(probId),
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (notifyLog.ok) {
          const notifyData = await notifyLog.json();
          console.log('Notification created successfully:', notifyData);
        } else {
          const errorData = await notifyLog.json();
          console.error('Error creating notification:', errorData.error);
        }

        console.log(`Problem marked as solved: ${probId}`);
      } else {
        console.error(`Error marking problem as solved: ${response.status}`);
      }
    } catch (error) {
      console.error('Error marking problem as solved:', error);
    }
  };
  const { data: notificationsResponse, error: notificationsError } = useSWR(
    `/api/notification?userId=${currentUserId}&action=check`,
    fetcher,
    {
      refreshInterval: 120000,
    }
  );
  const notifications = notificationsResponse?.notifications;
  // console.log(notifications);
  const canupvote = (userId, probId) => {
    if (notifications) {
      const filteredNotifications = notifications?.filter(
        (notification) =>
          notification.logProblemId === probId &&
          notification.logAction === 'upvote' &&
          // notification.logAnswerId === answerId &&
          notification.fromUserId === userId
      );
      // console.log(filteredNotifications);
      if (filteredNotifications.length > 0) {
        return false;
      } else {
        return true;
      }
    }
  };
  const handleUpvote = async () => {
    if (!session) {
      router.push('/login');
      return;
    }
    if(!canupvote(currentUserId, probId)) {
      alert('You have already upvoted this problem');
      return;
    }
    try {
      const userResponse = await fetch(`/api/user/${currentUserId}`);
      const userData = await userResponse.json();

      const respectPointsToAdd = userData.user.respectPoints * 0.1;

      setIsUpvoted(true);

      const upvoteResponse = await fetch(`/api/problem/${probId}?action=upvote`, {
        method: 'POST',
        body: JSON.stringify({ respectPointsToAdd, userId }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (upvoteResponse.ok) {
        const notifyLog = await fetch('/api/notification', {
          method: 'POST',
          body: JSON.stringify({
            fromUserId: currentUserId, // Provide the fromUserId
            fromUserName: session.token.name,
            toUserId: userId,
            logType: 'notification',
            logAction: 'upvote',
            logProblemId: probId,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const notifyData = await notifyLog.json();
        console.log('Notification created successfully:', notifyData);
        const upvoteData = await upvoteResponse.json();
        console.log('Upvote successful:', upvoteData);
      } else {
        console.error('Error upvoting:', upvoteResponse.status);
      }
    } catch (error) {
      console.error('Error upvoting:', error);
    }
  };


  const onOpenProblem = () => {
    router.push(`/problem/${probId}`);
  };

  const handleOnEdit = async () => {
    if (!session) {
      router.push('/login');
      return;
    }

    try {
      const response = await fetch(`/api/problem/${probId}`);
      const data = await response.json();

      if (response.ok) {
        router.push(`/edit/${probId}`);
      } else {
        console.error('Error fetching problem data:', data.error);
      }
    } catch (error) {
      console.error('Error editing problem:', error);
    }
  };

  const handleOnDelete = async () => {
    if (!session) {
      router.push('/login');
      return;
    }

    // ;

    try {
      const response = await fetch(`/api/problem/${probId}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (response.ok) {
        console.log('Problem deleted successfully');
        router.push('/problem');
      } else {
        console.error('Error deleting problem:', data.error);
      }
    } catch (error) {
      console.error('Error deleting problem:', error);
    }
  };

  const { pathname } = useRouter();
  const isAllProblemPage = () => pathname === '/problem';
  const ownProblem = () => currentUserId === userId;
  return (
    problemStatus !== 'solved' && (
      <CenteredCardContainer>
        <StyledCard>
          <CardHeader
            title={title}
            // subheader={`Posted by ${userName} • ${createdAt}`}
            
            subheader={
              <>
                Posted by{' '}
                <Link href={`/profile/${userId}`}>
                  <Typography color="info.main">{postingUser()}</Typography>
                </Link>{' '}
                • {createdAt}
              </>
            }
            
            style={{ paddingBottom: 0 }}
          />
          <CardContent>
            <TypeTagWrapper>
              {tags &&
                tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
            </TypeTagWrapper>

            <Body>{body}</Body>
            <TotalUpvotesWrapper>
              {/* <UpvoteCount>{totalUpvotes}</UpvoteCount> */}
              {(totalUpvotes > 0 && <UpvoteLogo>{totalUpvotes} Upvotes</UpvoteLogo>)}
            </TotalUpvotesWrapper>
            <Box>
              {session && currentUserId !== userId && (
                <>
                  {!isUpvoted && canupvote(currentUserId, probId) && (
                    <ActionButton variant="contained" color="primary" onClick={handleUpvote}>
                      Upvote
                    </ActionButton>
                  )}
                  {(!canupvote(currentUserId, probId) || isUpvoted) && (
                    <ActionButton variant="contained" color="success" disabled>
                      Upvote
                    </ActionButton>
                  )}
                  {!ownProblem() && (
                    <ActionButton variant="contained" color="secondary" onClick={onOpenProblem}>
                      Solve
                    </ActionButton>
                  )}
                </>
              )}

              {session && currentUserId === userId && (
                <>
                  <ActionButton variant="contained" color="primary" onClick={handleOnEdit}>
                    Edit
                  </ActionButton>
                  <ActionButton variant="contained" color="secondary" onClick={handleOnDelete}>
                    Delete
                  </ActionButton>
                  <ActionButton variant="contained" onClick={handleOnMarkAsSolved}>
                    Mark as Solved
                  </ActionButton>
                  {
                    <ActionButton variant="contained" onClick={onOpenProblem}>
                      Open Problem
                    </ActionButton>
                  }
                </>
              )}

              {!session && isAllProblemPage() && (
                <ActionButton variant="contained" onClick={onOpenProblem}>
                  Open Problem
                </ActionButton>
              )}
            </Box>
          </CardContent>
        </StyledCard>
      </CenteredCardContainer>
    )
  );
}

export default CardComponent;
