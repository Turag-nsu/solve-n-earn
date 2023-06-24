import { signIn, getSession } from 'next-auth/react';
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
  const handleSignIn = async () => {
    await signIn('google');
  };

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

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (session) {

    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
