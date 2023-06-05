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

  const onOpenProblem = () => {
    router.push(`/problem/${probId}`);
  };
  const { data:session } = useSession();

  const USER = parseInt(session.token.sub)
  
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
            {tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </TypeTagWrapper>
          <Body>{body}</Body>
          <TotalUpvotesWrapper>
            <UpvoteCount>{totalUpvotes}</UpvoteCount>
            <UpvoteLogo>Upvote</UpvoteLogo>
          </TotalUpvotesWrapper>
          <Box>
            {session && USER != userId && (
              <>
                <ActionButton variant="contained" color="primary" onClick={props.onUpvote}>
                  Upvote
                </ActionButton>
                <ActionButton variant="contained" color="secondary" onClick={onOpenProblem}>
                  Solve
                </ActionButton>
              </>
            )}
            {USER === userId && (
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
