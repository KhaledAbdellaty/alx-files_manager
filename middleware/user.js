// import { ObjectId } from 'mongodb';
// import dbClient from '../utils/db';
// import redisClient from '../utils/redis';

// const checkAuth = (req, res, next) => {
//   const token = req.headers['x-token'];
//   if (!token) return res.status(401).send({ error: 'Unauthorized' });
//   next();
//   return token;
// };

// const getUser = async (req, res, next) => {
//   const token = await checkAuth(req, res, next);
//   const userId = await redisClient.get(`auth_${token}`);
//   if (!userId) return res.status(401).send({ error: 'Unauthorized' });
//   const user = await dbClient.db.collection('users').findOne({ _id: ObjectId(userId) });
//   if (!user) return res.status(401).send({ error: 'Unauthorized' });
//   console.log(user);
//   next();
//   return user;
// };

// module.exports = getUser;
