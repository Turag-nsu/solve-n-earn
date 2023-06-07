import { useState } from 'react';
import { Card, CardContent, CardHeader, Typography, Button, Box, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';

import { useSession } from 'next-auth/react';
import { TryRounded } from '@mui/icons-material';

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
  const { probId, title, tags, body, totalUpvotes, problemStatus, userName, createdAt, userId } = props;
  const router = useRouter();
  const { data: session } = useSession();

  const [isUpvoted, setIsUpvoted] = useState(false);
  // const [userRespectPoints, setUserRespectPoints] = useState(0);

  const onOpenProblem = () => {
    router.push(`/problem/${probId}`);
  };
  const handleOnMarkAsSolved = async () => {
    const currentUserId = await session.token.sub;
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
        console.log(`Problem marked as solved: ${probId}`);
      } else {
        console.error(`Error marking problem as solved: ${response.status}`);
      }
    } catch (error) {
      console.error('Error marking problem as solved:', error);
    }
  };
  
  const handleUpvote = async () => {
    if (!session) {
      
      router.push('/login');
      return;
    }
    const currentUserId = await session.token.sub;
    try {
      // Fetch the user's respect points
      const userResponse = await fetch(`/api/user/${currentUserId}`);
      const userData = await userResponse.json();
  
      const respectPointsToAdd = userData.user.respectPoints * 0.1; // 10% of user's respect points
  
      
      setIsUpvoted(true);
  
      
      const upvoteResponse = await fetch(`/api/problem/${probId}?action=upvote`, {
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
  const handleOnEdit = async () => {
    if (!session) {
      // Handle the case when the user is not logged in
      router.push('/login'); // Replace with your login page route
      return;
    }
    
    try {
      // Fetch the problem data for editing
      const response = await fetch(`/api/problem/${probId}`);
      const data = await response.json();
      
      if (response.ok) {
        // Redirect to the edit page with the problem data
        router.push(`/edit/${probId}`);
      } else {
        // Handle the case when the problem data cannot be fetched
        console.error('Error fetching problem data:', data.error);
      }
    } catch (error) {
      // Handle the error as needed
      console.error('Error editing problem:', error);
    }
  };
  const handleOnDelete = async () => {
    if (!session) {
      // Handle the case when the user is not logged in
      router.push('/login'); // Replace with your login page route
      return;
    }
    
    const currentUserId = session.token.sub;
    
    try {
      // Send a DELETE request to delete the problem
      const response = await fetch(`/api/problem/${probId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      
      if (response.ok) {
        // Handle the successful deletion of the problem
        console.log('Problem deleted successfully');
        // Redirect to a relevant page, e.g., the homepage
        router.push('/problem');
      } else {
        // Handle the case when the problem deletion fails
        console.error('Error deleting problem:', data.error);
      }
    } catch (error) {
      // Handle the error as needed
      console.error('Error deleting problem:', error);
    }
  };
  
  // console.log(parseInt(session.token.sub), userId)

  return (problemStatus!==`solved`)&&(
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
            {session && parseInt(session.token.sub) !== userId &&  (
              <>
                {!isUpvoted &&(<ActionButton variant="contained" color="primary" onClick={handleUpvote}>
                  Upvote
                </ActionButton>)}
                <ActionButton variant="contained" color="secondary" onClick={onOpenProblem}>
                  Solve
                </ActionButton>
              </>
            )}
            
            {session && parseInt(session.token.sub) === userId && (
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
