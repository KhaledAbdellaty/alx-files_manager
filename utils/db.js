const { MongoClient } = require('mongodb');

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || '27017';
    const database = process.env.DB_DATABASE || 'file_manager';
    const uri = `mongodb://${host}:${port}`;

    MongoClient.connect(uri, { useUnifiedTopology: true }, (err, client) => {
      if (err) {
        console.log(err.message);
        this.db = false;
      } else {
        this.db = client.db(database);
      }
    });
  }

  isAlive() {
    return !!this.db;
  }

  async setOne(collection, value) {
    if (!this.db) return null;
    const queue = await this.db.collection(collection).insertOne(value);
    return queue;
  }

  async getOne(collection, value) {
    if (!this.db) return null;
    const queue = await this.db.collection(collection).findOne(value);
    return queue;
  }

  async nbUsers() {
    if (!this.db) {
      return 0;
    }
    try {
      const usersCollection = this.db.collection('users');
      return await usersCollection.countDocuments();
    } catch (error) {
      console.error('Error counting users:', error);
      return -1;
    }
  }

  async nbFiles() {
    if (!this.db) {
      return 0;
    }
    try {
      const filesCollection = this.db.collection('files');
      return await filesCollection.countDocuments();
    } catch (error) {
      console.error('Error counting files:', error);
      return -1;
    }
  }
}

const dbClient = new DBClient();
export default dbClient;
