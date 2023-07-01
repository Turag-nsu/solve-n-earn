import { useState, useEffect } from 'react';
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
} from '@mui/material';
import { useSession } from 'next-auth/react';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';

const NotificationsContainer = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  boxShadow: theme.shadows[2],
  maxWidth: 500,
  margin: 'auto',
}));

const Title = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const StyledList = styled(List)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const StyledListItem = styled(ListItem)(({ theme, unread }) => ({
  backgroundColor: unread ? theme.palette.action.hover : 'transparent',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const StyledListItemText = styled(ListItemText)({
  flex: '1',
});

const StyledButton = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(1),
}));

function Notifications() {
  const theme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#ff5722',
      },
    },
  });

  const router = useRouter();
  const { data: session, status } = useSession();
  const [notifications, setNotifications] = useState([]);
  const currentUserId = parseInt(session?.token?.sub);

  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data: notificationData, error, mutate } = useSWR(`/api/notification?userId=${currentUserId}`, fetcher);

  useEffect(() => {
    if (notificationData) {
      setNotifications(notificationData.notifications);
    }
  }, [notificationData]);

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(`/api/notification?notificationId=${notificationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ logStatus: 'read' }),
      });
      if (response.ok) console.log("Successfully marked as read");
      mutate(); // Refresh notifications after marking as read
    } catch (error) {
      console.error(error);
    }
  };

  if (error) {
    return <Typography variant="body1">Failed to load notifications.</Typography>;
  }

  if (status === 'loading') {
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

  if (status === 'loading') return <Typography variant="body1">Loading notifications...</Typography>;
  if (!notifications) return <Typography variant="body1">No notifications.</Typography>;

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
                <a onClick={() => router.push(`problem/${notification.logProblemId}`)}>
                  <StyledListItemText
                    primaryTypographyProps={{ variant: 'subtitle1', color: 'secondary' }}
                    primary={notification.logDetails}
                    secondary={formatDistanceToNow(extractCreatedAt(notification._id), { addSuffix: true })}
                  />
                </a>
                {notification.logStatus === 'unread' && (
                  <StyledButton variant="outlined" onClick={() => markAsRead(notification._id)}>
                    <MarkAsUnreadIcon />
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

export default Notifications;
