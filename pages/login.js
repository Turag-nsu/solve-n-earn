import { signIn, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button, Container, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
});

const StyledButton = styled(Button)({
  marginTop: '1rem',
});

export default function Login() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && session) {
      router.replace('/');
    }
  }, [status, session, router]);

  const handleSignIn = async () => {
    await signIn('google');
  };
  
  if (session) {
    router.replace('/');
  }
  return (
    <StyledContainer>
      <Typography variant="h3" component="h3" align="center" gutterBottom>
        Please use your North South account
      </Typography>
      <StyledButton variant="contained" onClick={handleSignIn}>
        Sign in with Google
      </StyledButton>
    </StyledContainer>
  );
}
