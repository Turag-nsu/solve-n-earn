import React from 'react';
import { Box } from '@mui/material';
import { Avatar, UserInfo, UserStats } from './ProfileMaker';

const ProfileWrapper = ({ children }) => (
  <Box maxWidth="600px" margin="0 auto" padding="16px">
    {children}
  </Box>
);

const Profile = ({ name, email, respectPoints, problems, image }) => {
  return (
    <ProfileWrapper>
      {image&&<Avatar path = {image}/>}
      <UserInfo name={name} email={email} respectPoints={respectPoints}/>
      <UserStats problems={problems} />
    </ProfileWrapper>
  );
};

export default Profile;
