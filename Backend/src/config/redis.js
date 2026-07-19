// const { createClient }  = require('redis');

// const redisClient = createClient({
//     username: 'default',
//     password: process.env.REDIS_PASS,
//     socket: {
//         host: 'fog-skin-sort-34873.db.redis.io',
//         port: 15610
//     }
// });

// module.exports = redisClient;

const { createClient } = require("redis");

const redisClient = createClient({
    username: "default",
    password: process.env.REDIS_PASS,
    socket: {
        host: "fog-skin-sort-34873.db.redis.io",
        port: 15610,
        connectTimeout: 10000,
    },
});

redisClient.on("connect", () => {
    console.log("Connecting to Redis...");
});

redisClient.on("ready", () => {
    console.log("Redis Ready!");
});

redisClient.on("error", (err) => {
    console.error("Redis Error:", err);
});

module.exports = redisClient;