import { useState } from 'react';
import { Typography, Box, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useSession, logout, signOut } from 'next-auth/react';
// import {  as Logout } from 'next-auth';
import { useRouter } from 'next/router';
import Image from 'next/image';
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

function AccountPage( {user, id} ) {
  const router = useRouter();
  const { data: session } = useSession();
  // console.log(user, id);
  // const { mutate } = useMutation();
  
  const [name, setName] = useState(user.name || '');
  const [image, setImage] = useState(user.image || '');
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [confirmationType, setConfirmationType] = useState('');

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleImageChange = (event) => {
    setImage(event.target.value);
  };

  const handleConfirmationOpen = (type) => {
    setConfirmationType(type);
    setOpenConfirmation(true);
  };

  const handleConfirmationClose = () => {
    setOpenConfirmation(false);
  };

  const handleUpdateName = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`/api/user/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      if (response.ok) {
        setName(name);
        handleConfirmationOpen('name');
        // mutate(); // Reload session data
      } else {
        throw new Error('Update name failed');
      }
    } catch (error) {
      console.error(error);
      // Show error message or perform any other actions
    }
  };

  const handleUpdateImageLink = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`/api/user/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image }),
      });

      if (response.ok) {
        handleConfirmationOpen('image');
        // mutate(); // Reload session data not works
        
      } else {
        throw new Error('Update image link failed');
      }
    } catch (error) {
      console.error(error);
      // Show error message or perform any other actions
    }
  };

  const handleConfirmationConfirm = () => {
    setOpenConfirmation(false);
    signOut({callbackUrl: `/login`});
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
        <Form onSubmit={handleUpdateImageLink}>
          <FormField
            label="Image Link"
            variant="outlined"
            fullWidth
            value={image}
            onChange={handleImageChange}
          />
          <SubmitButton variant="contained" color="primary" type="submit">
            Update Image Link
          </SubmitButton>
        </Form>
      </AccountContainer>

      <Dialog open={openConfirmation} onClose={handleConfirmationClose}>
        <DialogTitle>Success</DialogTitle>
        <DialogContent>
          { confirmationType === 'image' && (<Image src={image} width={200} height={200} />) }
          <Typography>
            {confirmationType === 'name'
              ? 'Name has been updated successfully!'
              : 'Image link has been updated successfully!'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmationConfirm} variant="contained" color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AccountPage;
