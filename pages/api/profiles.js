// api/profiles.js

const profiles = [
    {
      id: 1,
      name: 'John Doe',
      bio: 'Frontend Developer',
      location: 'New York, USA',
      email: 'john.doe@example.com',
      paymentMethod: 'Credit Card',
      posts: [
        {
          id: 1,
          title: 'Post 1',
          type: 'Article',
          tag: 'Technology',
          body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          totalUpvotes: 10,
        },
        {
          id: 2,
          title: 'Post 2',
          type: 'Video',
          tag: 'Tutorial',
          body: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          totalUpvotes: 5,
        },
        // Add more posts for John Doe if needed
      ],
    },
    {
      id: 2,
      name: 'Jane Smith',
      bio: 'Backend Developer',
      location: 'London, UK',
      email: 'jane.smith@example.com',
      paymentMethod: 'PayPal',
      posts: [
        {
          id: 1,
          title: 'Post 1',
          type: 'Article',
          tag: 'Technology',
          body: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          totalUpvotes: 15,
        },
        {
          id: 2,
          title: 'Post 2',
          type: 'Video',
          tag: 'Tutorial',
          body: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
          totalUpvotes: 8,
        },
        // Add more posts for Jane Smith if needed
      ],
    },
    // Add more profile objects as needed
  ];
  
  export function getAllProfileIds() {
    return profiles.map((profile) => ({
      params: {
        userId: profile.id.toString(),
      },
    }));
  }
  
  export function getProfileData(userId) {
    const profile = profiles.find((p) => p.id === Number(userId));
    return profile;
  }
  