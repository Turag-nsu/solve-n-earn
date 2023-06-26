import User from '@/utility/database/models/userSchema';
import connectToDatabase from '@/utility/database/databaseConnection';

export default async function handler(req, res) {
    const dbUser = process.env.DB_USERNAME;
    const dbPass = process.env.DB_PASSWORD;
    connectToDatabase(dbUser, dbPass);

    const users = await User.find().exec();
    if(!users) return res.status(404).json({error: 'Users not found'});
    res.status(200).json(users);
}