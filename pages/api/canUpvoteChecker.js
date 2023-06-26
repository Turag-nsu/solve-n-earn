// import Log from '@/utility/database/models/logSchema';
// import connectToDatabase from '@/utility/database/databaseConnection';
// // const canUpvoteChecker = async (userId, answerId) => {
// //     const dbuser = process.env.DB_USERNAME;
// //     const dbpass = process.env.DB_PASSWORD;
// //     connectToDatabase(dbuser, dbpass);
    
// //     try{
// //         const log1 = await Log.findOne({fromUserId: parseInt(userId), logAction: 'upvote', logAnswerId: answerId.toString()});
// //         const log2 = await Log.findOne({fromUserId: parseInt(userId), logAction: 'upvote', logProblemId: answerId.toString()});
// //         if(log1 || log2) return false;
// //         return true;
// //     }catch(error){
// //         console.log(error);
// //         return false;
// //     }
// // }
// // export default canUpvoteChecker;
// const canUpvoteChecker = async (fromUserId, toUserId) => {
//     const dbuser = process.env.DB_USERNAME;
//     const dbpass = process.env.DB_PASSWORD;
//     connectToDatabase(dbuser, dbpass);
//     try {
//       const existingLog = await Log.findOne({
//         fromUserId: fromUserId,
//         toUserId: toUserId,
//         logType: 'notification',
//         logAction: 'upvote',
//       });
  
//       return !existingLog;
//     } catch (error) {
//       console.error(error);
//       throw new Error('Failed to check upvote status');
//     }
//   };
//   export default canUpvoteChecker;