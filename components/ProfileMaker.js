import React from 'react';
import { Box, Typography, createTheme, ThemeProvider } from '@mui/material';
import { styled } from '@mui/material/styles';
import CardComponent from './CardComponent';
import { useSession } from 'next-auth/react';
import { formatDistanceToNow } from 'date-fns';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff5722',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0bec5',
    },
  },
});

const StyledAvatar = styled('div')(({ theme }) => ({
  width: '120px',
  height: '120px',
  margin: '0 auto',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '50%',
  background: `radial-gradient(circle at center, #ff5722, #32cd32)`,
  boxShadow: '0px 0px 8px #32cd32',
}));

const AvatarImage = styled('img')({
  maxWidth: '114px',
  maxHeight: '114px',
  width: '95%',
  height: '95%',
  objectFit: 'cover',
  borderRadius: '50%',
});


const Avatar = () => {
  const { data: session } = useSession();
  const path = session?.session?.user?.image;
  // console.log(path);
  return (
    <ThemeProvider theme={theme}>
      <StyledAvatar>
        {<AvatarImage src={path} alt="user profile picture" />||<AvatarImage src="https://i.imgur.com/6VBx3io.png" alt="user profile picture" />}
      </StyledAvatar>
    </ThemeProvider>
  );
};

const UserInfoWrapper = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: '4px',
  boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.3)',
}));

const Name = styled(Typography)(({ theme }) => ({
  fontSize: '1.8rem',
  fontWeight: 600,
  marginBottom: theme.spacing(1),
  color: theme.palette.text.primary,
}));

const Email = styled(Typography)(({ theme }) => ({
  fontSize: '1.2rem',
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

const RespectPoints = styled(Typography)(({ theme }) => ({
  fontSize: '1.2rem',
  fontWeight: 600,
  color: theme.palette.primary.main,
}));

const UserInfo = ({ name, email, respectPoints }) => {
  return (
    <ThemeProvider theme={theme}>
      <UserInfoWrapper>
        <Name>{name}</Name>
        <Email>{email}</Email>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body1" color="textSecondary" sx={{ marginRight: '4px' }}>
            Respect Points:
          </Typography>
          <RespectPoints>{respectPoints?.toFixed(2)}</RespectPoints>
        </Box>
      </UserInfoWrapper>
    </ThemeProvider>
  );
};

const UserStatsWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: theme.spacing(4),
  marginTop: theme.spacing(4),
}));

const StatWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
});

const StatIcon = styled(Box)(({ theme }) => ({
  borderRadius: '5%',
  backgroundColor: theme.palette.primary.main,
  marginRight: theme.spacing(2),
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '110%',
  height: '40px',
  boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.3)',
  padding: theme.spacing(1),
}));

const UserStats = ({ problems }) => {
  const { data: session } = useSession();

  if (!Array.isArray(problems) || problems.length === 0) {
    return (
      <ThemeProvider theme={theme}>
        <UserStatsWrapper>
          <Typography variant="h6" color="textSecondary">
            No problems found
          </Typography>
        </UserStatsWrapper>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <UserStatsWrapper>
        <StatWrapper>
          <StatIcon>
            <Typography variant="h6" color="textSecondary">
              Posts
            </Typography>
          </StatIcon>
        </StatWrapper>
        <Box
          sx={{
            width: '100%',
            maxHeight: '500px',
            overflow: 'auto',
            padding: theme.spacing(2),
            backgroundColor: theme.palette.background.paper,
            borderRadius: '4px',
            boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.3)',
          }}
        >
          {problems.map((post) => {
            const createdAt = new Date(parseInt(post._id.toString().substring(0, 8), 16) * 1000);
            const formattedCreatedAt = formatDistanceToNow(createdAt, { addSuffix: true });

            return (
              <React.Fragment key={post.id}>
                <CardComponent
                  probId={post.id}
                  title={post.title}
                  type={post.type}
                  tag={post.tag}
                  body={post.body}
                  totalUpvotes={post.upvotes}
                  onClick={post.onClick}
                  userId={post.userId}
                  userName={`user`}
                  createdAt={formattedCreatedAt}
                />
              </React.Fragment>
            );
          })}
        </Box>
      </UserStatsWrapper>
    </ThemeProvider>
  );
};

export { Avatar, UserInfo, UserStats };
