import React from 'react';
import { Box, Typography, createTheme, ThemeProvider } from '@mui/material';
import { styled } from '@mui/material/styles';
import CardComponent from './CardComponent';
import { useSession } from 'next-auth/react';
import { formatDistanceToNow } from 'date-fns';
// import {  } from 'styled-components';


const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff5722',
    },
  },
});

const StyledAvatar = styled('div')(({ theme }) => ({
  width: '80px',
  height: '80px',
  margin: '0 auto',
  backgroundColor: theme.palette.primary.main,
  borderRadius: '50%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

const Avatar = () => {
  
  return (
    <ThemeProvider theme={theme}>
    <StyledAvatar>
      <Typography variant="h3" color="textPrimary">
        A
      </Typography>
    </StyledAvatar>
    </ThemeProvider>
  );
};

const UserInfoWrapper = styled(Box)(({ theme }) => ({
  marginTop: '2rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '16px',
  backgroundColor: theme.palette.background.paper,
  borderRadius: '4px',
}));

const Name = styled(Typography)(({ theme }) => ({
  fontSize: '1.25rem',
  fontWeight: 600,
  marginBottom: '8px',
  color: theme.palette.text.primary,
}));

const Email = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  color: theme.palette.text.secondary,
  marginBottom: '8px',
}));

const UserInfo = ({ name, email, respectPoints }) => {
  

  return (
    <ThemeProvider theme={theme}>
    <UserInfoWrapper>
      <Name>{name}</Name>
      <Name>{`Respectpoints: ${respectPoints.toFixed(2)}`}</Name>
      <Email>{email}</Email>
    </UserInfoWrapper>
    </ThemeProvider>
  );
};

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
  borderRadius: '2%',
  backgroundColor: theme.palette.primary.main,
  marginRight: '8px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

const UserStats = ({ problems }) => {
  // const theme = useTheme();
  const { data: session } = useSession();

  if (!Array.isArray(problems)) {
    return <div>No problems found</div>;
  }

  return (
    <ThemeProvider theme={theme}>
    <UserStatsWrapper>
      <StatWrapper>
        {/* <StatIcon>
          <Typography variant="h6" color="textSecondary">
            Respect Points: {}
          </Typography>
        </StatIcon> */}
        <Typography variant="h6" color="white">
          Posts
        </Typography>
      </StatWrapper>
      <Box sx={{ width: '100%', maxHeight: '500px', overflow: 'auto' }}>
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
