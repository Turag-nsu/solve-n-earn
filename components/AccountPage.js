import { useState } from 'react';
import { Typography, Box, TextField, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';

const AccountContainer = styled('div')(({ theme }) => ({
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

const Form = styled('form')(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const FormField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  marginRight: theme.spacing(1),
}));

const DeleteButton = styled(Button)(({ theme }) => ({
  // color: theme.palette.error.main,
}));

function AccountPage({ user }) {
  const [name, setName] = useState(user.name || '');

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleUpdateName = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`/api/user/${user.id}`, { name });
      // Show success message or perform any other actions
    } catch (error) {
      console.error(error);
      // Show error message or perform any other actions
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.delete(`/api/user/${user.id}`);
      // Show success message or perform any other actions (e.g., redirect to another page)
    } catch (error) {
      console.error(error);
      // Show error message or perform any other actions
    }
  };

  return (
    <Box p={4}>
      <AccountContainer>
        <Title variant="h4" gutterBottom>
          Account
        </Title>
        <Form onSubmit={handleUpdateName}>
          <FormField
            label="Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={handleNameChange}
          />
          <SubmitButton variant="contained" color="primary" type="submit">
            Update Name
          </SubmitButton>
        </Form>
        <DeleteButton variant="contained" color='error' onClick={handleDeleteAccount}>
          Delete Account
        </DeleteButton>
      </AccountContainer>
    </Box>
  );
}

export default AccountPage;
