import redis from 'redis';

// Handle redis client
class RedisClient {
  constructor() {
    this.client = redis.createClient({
      host: 'localhost',
      port: 6379,
    }).on('error', redis.print);
  }

  // Checks if connection to redis is successful
  isAlive() {
    return this.client.connected;
  }

  // Returns value stored in a key
  async get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (error, value) => {
        if (error) {
          reject(error);
        } else {
          resolve(value);
        }
      });
    });
  }

  // Takes 3 args: key (str), value, duration (expiration in seconds)
  async set(key, value, duration) {
    return new Promise((resolve, reject) => {
      this.client.setex(key, duration, value, (error, value) => {
        if (error) {
          reject(error);
        } else {
          resolve(value);
        }
      });
    });
  }

  // Deletes value of key argument in redis
  async del(key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (error, value) => {
        if (error) {
          reject(error);
        } else {
          resolve(value);
        }
      });
    });
  }
}

const redisClient = new RedisClient();
module.exports = redisClient;
