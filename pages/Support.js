import { Typography, Box, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const SupportContainer = styled('div')(({ theme }) => ({
//   backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  boxShadow: theme.shadows[2],
  maxWidth: 500,
  margin: 'auto',
}));

const Title = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const Content = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const SupportButton = styled(Button)(({ theme }) => ({
  marginRight: theme.spacing(1),
}));

function SupportPage() {
  return (
    <Box p={4}>
      <SupportContainer>
        <Title variant="h4" gutterBottom>
          Support
        </Title>
        <Content variant="body1" gutterBottom>
          If you need any assistance or have any questions, please feel free to reach out to our support team.
        </Content>
        <Content variant="body1" gutterBottom>
          You can contact us through the following methods:
        </Content>
        <SupportButton variant="outlined" color="primary" href="mailto:nsu.turag@gmail.com">
          Email
        </SupportButton>
        <SupportButton variant="outlined" color="primary" href="tel:+8801712666175">
          Phone
        </SupportButton>
      </SupportContainer>
    </Box>
  );
}

export default SupportPage;
