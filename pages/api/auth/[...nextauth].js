import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import userSchema from '@/utility/database/models/userSchema';

const options = {
  secret: process.env.GOOGLE_CLIENT_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async signIn({ account, profile, user }) {
      const { email, name, picture } = profile;
      if (account.provider === 'google' && email.endsWith('@gmail.com')) {
        const existingUser = await userSchema.findOneAndUpdate(
          { email },
          { name, email, image: picture, authProvider: 'google' },
          { upsert: true, new: true }
        );

        user.id = existingUser.id;
        user.name = existingUser.name;
        user.image = existingUser.image;
      }

      return profile.email_verified && email.endsWith('@gmail.com');
    },

    async session(session, user) {
      if (user) {
        session.user = {
          ...session.user,
          id: user.id,
          name: user.name,
          image: user.image,
        };
      }

      return session;
    },
   
  },
};

export default (req, res) => NextAuth(req, res, options);
