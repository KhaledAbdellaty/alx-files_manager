import { ObjectId } from 'mongodb';
import { promises } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const allowedTypes = ['folder', 'file', 'image'];
const folderPath = process.env.FOLDER_PATH || '/tmp/files_manager';

class FileController {
  static async postUpload(req, res) {
    const token = req.headers['x-token'];
    if (!token) return res.status(401).send({ error: 'Unauthorized' });
    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) return res.status(401).send({ error: 'Unauthorized' });
    const user = await dbClient.db.collection('users').findOne({ _id: ObjectId(userId) });
    if (!user) return res.status(401).send({ error: 'Unauthorized' });

    const {
      name,
      type,
      parentId = 0,
      isPublic = false,
      data,
    } = req.body;

    if (!name) return res.status(400).send({ error: 'Missing name' });
    if (!type || !allowedTypes.includes(type)) return res.status(400).send({ error: 'Missing type' });
    if (!data && type !== allowedTypes[0]) return res.status(400).send({ error: 'Missing data' });
    if (parentId !== 0) {
      const file = await dbClient.getOne('files', { _id: ObjectId(parentId) });
      if (!file) return res.status(400).send({ error: 'Parent not found' });
      if (file.type !== allowedTypes[0]) return res.status(400).send({ error: 'Parent is not a folder' });
    }
    const newFile = {
      name,
      type,
      isPublic,
      userId,
      parentId: parentId === 0 ? 0 : ObjectId(parentId),
    };
    if (type === allowedTypes[0]) {
      const result = await dbClient.setOne('files', newFile);
      newFile.id = result.insertedId;
      return res.status(201).send(newFile);
    }
    await promises.mkdir(folderPath, { recursive: true });
    const fileName = uuidv4();
    const localPath = path.join(folderPath, fileName);

    const fileContent = Buffer.from(data, 'base64');
    await promises.writeFile(localPath, fileContent);
    if (type === allowedTypes[1] || type === allowedTypes[2]) {
      newFile.localPath = localPath;
    }

    const result = await dbClient.setOne('files', newFile);
    newFile.id = result.insertedId;
    delete newFile.localPath;

    return res.status(201).send(newFile);
  }
}

export default FileController;
