import React from 'react';
import { useRouter } from 'next/router';
import { styled, useTheme } from '@mui/material/styles';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  Button,
} from '@mui/material';
import { Menu as MenuIcon, Add as AddIcon } from '@mui/icons-material';
import Container from '@mui/material/Container';
import { signOut, useSession } from 'next-auth/react';

const pages = ['Notification', 'Support', 'Blog'];
const settings = ['Profile', 'Account', 'Dashboard'];

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontFamily: 'monospace',
  fontWeight: 700,
  letterSpacing: '.3rem',
  color: 'inherit',
  textDecoration: 'none',
  marginRight: 2,
  display: 'flex',
  [theme.breakpoints.down('xs')]: {
    display: 'none',
  },
}));

const StyledTypographyMobile = styled(Typography)(({ theme }) => ({
  fontFamily: 'monospace',
  fontWeight: 700,
  letterSpacing: '.3rem',
  color: 'inherit',
  textDecoration: 'none',
  marginRight: 2,
  display: 'none',
  [theme.breakpoints.down('xs')]: {
    display: 'flex',
  },
}));

const ResponsiveAppBar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const { data: session, status } = useSession();
  const router = useRouter();
  const theme = useTheme();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    signOut({ callbackUrl: 'https://solve-n-earn.vercel.app/login' });
  };

  const handleMenuClick = (path) => {
    if (path === '/Profile') {
      router.push(`/profile/${session.token.sub}`);
    } else {
      router.push(path);
    }
    handleCloseNavMenu();
    handleCloseUserMenu();
  };

  const handlePostProblem = () => {
    router.push('/problem/postProblem');
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component="a"
            href="/problem"
            onClick={() => handleMenuClick('/problem')}
            style={{ textDecoration: 'none', color: 'inherit', marginRight: '2px', display: 'flex' }}
          >
            Solve N Earn
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={() => handleMenuClick(`/${page}`)}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <MenuItem key={page} onClick={() => handleMenuClick(`/${page}`)}>
                <Typography textAlign="center">{page}</Typography>
              </MenuItem>
            ))}
          </Box>
          <Typography
            variant="h6"
            component="a"
            href="/problem"
            onClick={() => handleMenuClick('/problem')}
            style={{
              textDecoration: 'none',
              color: 'inherit',
              marginRight: '2px',
              display: 'none',
              [theme.breakpoints.down('xs')]: {
                display: 'flex',
              },
            }}
          >
            Solve N Earn
          </Typography>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton
                onClick={handleOpenUserMenu}
                sx={{ p: 0 }}
                className="avatar-button"
              >
                <Avatar alt="Remy Sharp" src="" />
              </IconButton>
            </Tooltip>
            <Menu
              className="menu"
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {status === 'authenticated' ? (
                <>
                  {settings.map((setting) => (
                    <MenuItem key={setting} onClick={() => handleMenuClick(`/${setting}`)}>
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ))}
                  <MenuItem onClick={handleLogout}>
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>
                </>
              ) : (
                <MenuItem onClick={() => handleMenuClick('/login')}>
                  <Typography textAlign="center">Login</Typography>
                </MenuItem>
              )}
            </Menu>
          </Box>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={handlePostProblem}
            sx={{ display: { xs: 'none', md: 'flex' }, marginLeft: '8px' }}
          >
            Post Problem
          </Button>
          <IconButton
            onClick={handlePostProblem}
            sx={{ display: { xs: 'flex', md: 'none' }, marginLeft: '8px' }}
            color="inherit"
          >
            <AddIcon />
          </IconButton>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default ResponsiveAppBar;
