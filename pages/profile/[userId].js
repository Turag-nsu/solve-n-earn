// pages/profile/[userId].js

import React from 'react';
import Profile from '../../components/Profile';
import { getAllProfileIds, getProfileData } from '../api/profiles';

const ProfilePage = ({ profileData }) => {
  if (!profileData) {
    return <div>Loading...</div>;
  }

  return (
    <Profile
      name={profileData.name}
      bio={profileData.bio}
      location={profileData.location}
      email={profileData.email}
      paymentMethod={profileData.paymentMethod}
      posts={profileData.po}
    />
  );
};

export async function getStaticPaths() {
  const paths = getAllProfileIds();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const { userId } = params;
  const profileData = getProfileData(userId);

  return {
    props: {
      profileData,
    },
  };
}

export default ProfilePage;
