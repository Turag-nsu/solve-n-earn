import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Container, Grid, IconButton, Typography } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const FooterWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));

const FooterContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(4, 0),
}));

const SocialIconContainer = styled(Grid)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));

const SocialIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: 'transparent',
  color: theme.palette.primary.contrastText,
  marginRight: theme.spacing(1),
  '&:hover': {
    backgroundColor: 'transparent',
    color: theme.palette.secondary.main,
  },
}));

const FooterText = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

function Footer() {
  return (
    <FooterWrapper>
      <FooterContainer>
        <SocialIconContainer container spacing={2}>
          <Grid item>
            <SocialIconButton>
              <FacebookIcon />
            </SocialIconButton>
          </Grid>
          <Grid item>
            <SocialIconButton>
              <TwitterIcon />
            </SocialIconButton>
          </Grid>
          <Grid item>
            <SocialIconButton>
              <LinkedInIcon />
            </SocialIconButton>
          </Grid>
        </SocialIconContainer>
        <FooterText variant="subtitle1">Follow us on social media</FooterText>
        <FooterText variant="body2">&copy; 2023 SolveNearn. All rights reserved.</FooterText>
      </FooterContainer>
    </FooterWrapper>
  );
}

export default Footer;
