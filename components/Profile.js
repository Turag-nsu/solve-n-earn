import React from 'react';
import { Box } from '@mui/material';
import { Avatar, UserInfo, UserStats } from './ProfileMaker';

const ProfileWrapper = ({ children }) => (
  <Box
    maxWidth="600px"
    margin="0 auto"
    padding="16px"
  >
    {children}
  </Box>
);

const Profile = ({ name, bio, location, email, paymentMethod, posts }) => {
  return (
    <ProfileWrapper>
      <Avatar />
      <UserInfo
        name={name}
        bio={bio}
        location={location}
        email={email}
        paymentMethod={paymentMethod}
      />
      <UserStats posts={posts}/>
    </ProfileWrapper>
  );
};

export default Profile;
