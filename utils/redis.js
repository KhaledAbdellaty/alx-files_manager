import redis from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = redis.createClient();

    this.client.on('error', (err) => {
      console.log(`Redis client error: ${err}`);
    });

    this.getAsync = promisify(this.client.get).bind(this.client);
    this.setAsync = promisify(this.client.setex).bind(this.client);
    this.delAsync = promisify(this.client.del).bind(this.client);
  }

  isAlive() {
    return this.client.connected;
  }

  async get(key) {
    try {
      return await this.getAsync(key);
    } catch (error) {
      return null;
    }
  }

  async set(key, value, duration) {
    try {
      return await this.setAsync(key, duration, value);
    } catch (error) {
      return null;
    }
  }

  async del(key) {
    try {
      return await this.delAsync(key);
    } catch (error) {
      return null;
    }
  }
}

const redisClient = new RedisClient();
export default redisClient;
