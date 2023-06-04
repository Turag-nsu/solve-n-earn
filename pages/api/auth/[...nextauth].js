import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import userSchema from '@/utility/database/models/userSchema';
import connectToDatabase from '@/utility/database/databaseConnection';

const options = {
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
      const { email, name } = profile;
      if (account.provider === 'google') {
        if (email.endsWith('@gmail.com')) {
          const existingUser = await userSchema.findOne({ email });
          
          if (!existingUser) {
            const newUser = await userSchema.create({
              id: Math.floor(Math.random() * 10000),
              name,
              email,
              authProvider: 'google',
            });
            user.id = newUser.id; // Set the userId in the user object
          }
          else if(existingUser){
            user.id = existingUser.id;
          }
          console.log(user)
        }
        return profile.email_verified && email.endsWith('@gmail.com');
      }
      return true;
    },
    
       
  },
};

export default (req, res) => NextAuth(req, res, options);
