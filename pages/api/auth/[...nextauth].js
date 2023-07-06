import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import userSchema from '@/utility/database/models/userSchema';
import connectToDatabase from '@/utility/database/databaseConnection';

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
      const dbuser = process.env.DB_USERNAME;
      const dbpass = process.env.DB_PASSWORD;
      connectToDatabase(dbuser, dbpass);
      const { email, name, picture } = profile;
      console.log(profile);
      if (account.provider === 'google') {
        if (email.endsWith('@gmail.com')) {
          const existingUser = await userSchema.findOne({ email });
          if (!existingUser.image) {
            existingUser.image = picture;
            await existingUser.save();

          }
          if (!existingUser) {
            const newUser = await userSchema.create({
              id: Math.floor(Math.random() * 10000),
              name,
              email,
              image: picture,
              authProvider: 'google',
            });
            user.id = newUser.id;
          } else {

            user.id = existingUser.id;
            user.name = existingUser.name;
            user.image = existingUser.image;

          }
        }

        return profile.email_verified && email.endsWith('@gmail.com');
      }

      return true;
    },

    async session(session, user) {
      if (user) {
        session.user.id = user.id;
        session.user.name = user.name;
        session.user.image = user.image;

      }

      return session;
    },
  },
};

export default (req, res) => NextAuth(req, res, options);
