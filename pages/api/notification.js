import connectToDatabase from '@/utility/database/databaseConnection';
import Log from '@/utility/database/models/logSchema';


export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const dbuser = process.env.DB_USERNAME;
            const dbpass = process.env.DB_PASSWORD;
            await connectToDatabase(dbuser, dbpass);

            // Get notifications for the logged-in user
            const { userId } = req.query;
            if (req.query.action === 'check') {
                const forUserId = parseInt(userId);
                const notifications = await Log.find({ fromUserId: forUserId, logAction: 'upvote', }).sort({ _id: -1 });
                res.status(200).json({ notifications });
            } else {
                const notifications = await Log.find({ toUserId: userId, logType: 'notification' }).sort({ _id: -1 });
                res.status(200).json({ notifications });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else if (req.method === 'POST') {
        try {
            const dbuser = process.env.DB_USERNAME;
            const dbpass = process.env.DB_PASSWORD;
            await connectToDatabase(dbuser, dbpass);
            // const { data: session } = await userSession(req, res);

            // Create a new notification
            let { fromUserName, fromUserId, toUserId, logType, logAction, logProblemId, logAnswerId } = req.body;
            toUserId = parseInt(toUserId);
            let logDetails = '';
            if (logAction === 'upvote') {
                logDetails = `${fromUserName} upvoted your answer`;
            } else if (logAction === 'downvote') {
                logDetails = `${fromUserName} downvoted your answer`;
            } else if (logAction === 'answered') {
                logDetails = `${fromUserName} answered your question`;
            }

            const newLog = new Log({
                logType,
                fromUserId,
                toUserId,
                logAction,
                logDetails,
                logStatus: 'unread',
                logProblemId,
                logAnswerId,
            });
            //   console.log(newLog);
            await newLog.save();

            res.status(200).json({ message: 'Notification created successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else if (req.method === 'PUT') {
        try {
            const dbuser = process.env.DB_USERNAME;
            const dbpass = process.env.DB_PASSWORD;
            await connectToDatabase(dbuser, dbpass);

            const { notificationId } = req.query;
            const { logStatus } = req.body;

            // Update notification status to 'read'
            await Log.findOneAndUpdate({ _id: notificationId }, { logStatus });

            res.status(200).json({ message: 'Notification updated successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
