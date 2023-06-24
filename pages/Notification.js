import { useEffect } from 'react';
import useSWR from 'swr';
import { formatDistanceToNow } from 'date-fns';
import MarkAsUnreadIcon from '@mui/icons-material/MarkAsUnread';
import {
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  useTheme,
  ThemeProvider,
  Box,
  createTheme,
  Icon,
} from '@mui/material';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';

const NotificationsContainer = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  boxShadow: theme.shadows[2],
  maxWidth: 500,
  margin: 'auto',
  // setCursor: 'pointer',
}));

const Title = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const StyledList = styled(List)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const StyledListItem = styled(ListItem)(({ theme, unread }) => ({
  backgroundColor: unread ? theme.palette.action.hover : 'transparent',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(1),
}));

function Notifications() {
  const theme = useTheme();
  const { data: session } = useSession();
  const { data: notifications, error, mutate } = useSWR(`/api/notification?userId=${session?.token.sub}`, fetcher);

  useEffect(() => {
    mutate(); // Refresh notifications after creating or updating
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`/api/notification/${notificationId}`, { logStatus: 'read' });
      mutate(); // Refresh notifications after marking as read
    } catch (error) {
      console.error(error);
    }
  };

  if (error) {
    return <Typography variant="body1">Failed to load notifications.</Typography>;
  }

  if (!notifications) {
    return <Typography variant="body1">Loading notifications...</Typography>;
  }

  const extractCreatedAt = (id) => {
    const timestamp = parseInt(id.substring(0, 8), 16) * 1000;
    return new Date(timestamp);
  };

  const customTheme = createTheme({
    ...theme,
    spacing: 4,
    palette: {
      ...theme.palette,
      primary: {
        main: '#3f51b5',
      },
      secondary: {
        main: '#f50057',
      },
    },
  });
  const router = useRouter();
  return (
    <ThemeProvider theme={customTheme}>
      <Box p={4}>
        <NotificationsContainer>
          <Title variant="h4" gutterBottom color="primary"> 
            Notifications
          </Title>
          <StyledList>
            {notifications.map((notification) => (
              <StyledListItem key={notification._id} unread={notification.logStatus === 'unread'}>
                <a onClick={()=>{router.push(`problem/${notification.logProblemId}`)}}>
                <ListItemText
                  primaryTypographyProps={{ variant: 'subtitle1' , color: "secondary"}}
                  primary={notification.logDetails}
                  secondary={formatDistanceToNow(extractCreatedAt(notification._id), { addSuffix: true })}
                />
                </a>
                {notification.logStatus === 'unread' && (
                  <StyledButton variant="outlined" onClick={() => markAsRead(notification._id)}>
                    <MarkAsUnreadIcon/>
                  </StyledButton>
                )}
              </StyledListItem>
            ))}
          </StyledList>
          {notifications.length === 0 && <Typography variant="body1">No notifications.</Typography>}
        </NotificationsContainer>
      </Box>
    </ThemeProvider>
  );
}

// Custom fetcher function for SWR
const fetcher = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data.notifications;
  } catch (error) {
    throw new Error('Failed to fetch notifications');
  }
};

export default Notifications;
