const Redis = require('ioredis');
const isProd = process.env.NODE_ENV === 'production';
let client;

if (isProd) {
    client = new Redis(process.env.REDIS_HOST, 6379, { password: process.env.REDIS_PASS });
} else {
    client = new Redis();
}

module.exports = client; 
