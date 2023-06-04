import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledAvatar = styled('div')({
  width: '80px',
  height: '80px',
  margin: '0 auto',
  backgroundColor: 'blue',
  borderRadius: '50%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const Avatar = () => {
  return (
    <StyledAvatar>
      <Typography variant="h3" color="textPrimary">
        A
      </Typography>
    </StyledAvatar>
  );
};

const UserInfoWrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '16px',
  backgroundColor: 'background.paper',
  borderRadius: '4px',
});

const Name = styled(Typography)({
  fontSize: '1.25rem',
  fontWeight: 600,
  marginBottom: '8px',
});

const Bio = styled(Typography)({
  fontSize: '1rem',
  marginBottom: '8px',
});

const Location = styled(Typography)({
  fontSize: '0.875rem',
  color: 'text.secondary',
  marginBottom: '8px',
});

const Email = styled(Typography)({
  fontSize: '0.875rem',
  color: 'text.secondary',
  marginBottom: '8px',
});

const PaymentMethod = styled(Typography)({
  fontSize: '0.875rem',
  color: 'text.secondary',
});

const UserInfo = ({ name, bio, location, email, paymentMethod }) => {
  return (
    <UserInfoWrapper>
      <Name>{name}</Name>
      <Bio>{bio}</Bio>
      <Location>{location}</Location>
      <Email>{email}</Email>
      <PaymentMethod>{paymentMethod}</PaymentMethod>
    </UserInfoWrapper>
  );
};

import CardComponent from './CardComponent';


const UserStatsWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  marginTop: theme.spacing(2),
}));

const StatWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '16px',
});

const StatIcon = styled(Box)(({ theme }) => ({
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  marginRight: '8px',
  width: '32px',
  height: '32px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

const UserStats = ({ postCount, posts }) => {
  return (
    <UserStatsWrapper>
      <StatWrapper>
        <StatIcon>
          <Typography variant="h6" color="textSecondary">
            {postCount}
          </Typography>
        </StatIcon>
        <Typography variant="h6" color="textSecondary">
          Posts
        </Typography>
      </StatWrapper>
      <Box sx={{ width: '100%', maxHeight: '500px', overflow: 'auto' }}>
        {posts.map((post) => (
            <CardComponent
            key={post.id}
            title={post.title}
            type={post.type}
            tag={post.tag}
            body={post.body}
            totalUpvotes={post.totalUpvotes}
            onClick={post.onClick}
            loggedInUser = {true}
            isOwner = {true}
            />
         
        ))}
      </Box>
    </UserStatsWrapper>
  );
};

export default UserStats;


export { Avatar, UserInfo, UserStats };
