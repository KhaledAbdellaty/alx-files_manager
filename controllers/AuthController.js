import { v4 as uuidv4 } from 'uuid';
import { ObjectId } from 'mongodb';
import sha1 from 'sha1';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class AuthController {
  static async getConnect(req, res) {
    const auth = req.header('Authorization') || '';
    const token = auth.split(' ')[1];

    if (!token) return res.status(401).send({ error: 'Unauthorized' });

    const tokenDecoded = Buffer.from(token, 'base64').toString('utf-8');

    const [email, password] = tokenDecoded.split(':');
    if (!email || !password) return res.status(401).send({ error: 'Unauthorized' });

    const hashPassword = sha1(password);
    const user = await dbClient.getOne('users', { email, password: hashPassword });
    if (!user) return res.status(401).send({ error: 'Unauthorized' });

    const newToken = uuidv4();
    const key = `auth_${newToken}`;
    await redisClient.set(key, user._id.toString(), (60 * 60));

    return res.status(201).send({ token: newToken });
  }

  static async getDisconnect(req, res) {
    const token = req.headers['x-token'];
    if (!token) return res.status(401).send({ error: 'Unauthorized' });
    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) return res.status(401).send({ error: 'Unauthorized' });
    const user = await dbClient.getOne('users', { _id: ObjectId(userId) });
    if (!user) return res.status(401).send({ error: 'Unauthorized' });
    await redisClient.del(`auth_${token}`);
    return res.status(204).send();
  }
}

export default AuthController;
