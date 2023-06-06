import { useState } from 'react';
import { Card, CardContent, CardHeader, Typography, Button, Box, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';

import { useSession } from 'next-auth/react';

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
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(0.5),
  height: theme.spacing(3),
  backgroundColor: theme.palette.primary.main,
}));

const CenteredCardContainer = styled(Box)({
  width: '90%',
  margin: 'auto',
});

const ActionButton = styled(Button)(({ theme }) => ({
  marginRight: theme.spacing(1),
}));

function CardComponent(props) {
  const { probId, title, tags, body, totalUpvotes, userName, createdAt, userId } = props;
  const router = useRouter();
  const { data: session } = useSession();

  const [isUpvoted, setIsUpvoted] = useState(false);
  // const [userRespectPoints, setUserRespectPoints] = useState(0);

  const onOpenProblem = () => {
    router.push(`/problem/${probId}`);
  };

  const handleUpvote = async () => {
    if (!session) {
      // Handle the case when the user is not logged in
      router.push('/login'); // Replace with your login page route
      return;
    }
    const currentUserId = await session.token.sub;
    try {
      // Fetch the user's respect points
      const userResponse = await fetch(`/api/user/${currentUserId}`);
      const userData = await userResponse.json();
  
      const respectPointsToAdd = userData.user.respectPoints * 0.1; // 10% of user's respect points
  
      // Update the local state
      setIsUpvoted(true);
  
      // Call the API to increase totalUpvotes and respectPoints
      const upvoteResponse = await fetch(`/api/problem/upvote/${probId}`, {
        method: 'POST',
        body: JSON.stringify({ respectPointsToAdd, userId }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const upvoteData = await upvoteResponse.json();
  
      // Handle the response as needed
      console.log('Upvote successful:', upvoteData);
    } catch (error) {
      // Handle the error as needed
      console.error('Error upvoting:', error);
    }
  };
  
  

  return (
    <CenteredCardContainer>
      <StyledCard>
        <CardHeader
          title={title}
          subheader={`Posted by ${userName} • ${createdAt}`}
          style={{ paddingBottom: 0 }}
        />
        <CardContent>
          <TypeTagWrapper>
            {tags && tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </TypeTagWrapper>

          <Body>{body}</Body>
          <TotalUpvotesWrapper>
            <UpvoteCount>{totalUpvotes}</UpvoteCount>
            <UpvoteLogo>Upvote</UpvoteLogo>
          </TotalUpvotesWrapper>
          <Box>
            {session && session.token.sub !== userId && !isUpvoted && (
              <>
                <ActionButton variant="contained" color="primary" onClick={handleUpvote}>
                  Upvote
                </ActionButton>
                <ActionButton variant="contained" color="secondary" onClick={onOpenProblem}>
                  Solve
                </ActionButton>
              </>
            )}
            {session && session.token.sub === userId && (
              <>
                <ActionButton variant="contained" color="primary" onClick={props.onEdit}>
                  Edit
                </ActionButton>
                <ActionButton variant="contained" color="secondary" onClick={props.onDelete}>
                  Delete
                </ActionButton>
                <ActionButton variant="contained" onClick={props.onMarkAsSolved}>
                  Mark as Solved
                </ActionButton>
              </>
            )}
            {!session && (
              <ActionButton variant="contained" onClick={onOpenProblem}>
                Open Problem
              </ActionButton>
            )}
          </Box>
        </CardContent>
      </StyledCard>
    </CenteredCardContainer>
  );
}

export default CardComponent;
