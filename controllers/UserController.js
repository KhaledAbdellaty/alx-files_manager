import sha1 from 'sha1';
import { ObjectId } from 'mongodb';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class UserController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    if (!email) return res.status(400).send({ error: 'Missing email' });
    if (!password) return res.status(400).send({ error: 'Missing password' });

    let newUser;
    const existUser = await dbClient.getOne('users', { email });
    if (existUser) return res.status(400).send({ error: 'Already exist' });

    const hashPassword = sha1(password);

    try {
      newUser = await dbClient.setOne('users', { email, password: hashPassword });
    } catch (err) {
      return res.status(500).send({ error: `Cannot create user: ${err}` });
    }

    return res.status(201).send({ id: newUser.insertedId, email });
  }

  static async getMe(req, res) {
    const token = req.headers['x-token'];
    if (!token) return res.status(401).send({ error: 'Unauthorized' });
    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) return res.status(401).send({ error: 'Unauthorized' });
    const user = await dbClient.getOne('users', { _id: ObjectId(userId) });
    if (!user) return res.status(401).send({ error: 'Unauthorized' });
    return res.status(200).send({ id: user._id, email: user.email });
  }
}

export default UserController;
