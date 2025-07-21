import {Redis} from "ioredis"

const connection = new Redis({host: "127.0.0.1", maxRetriesPerRequest: null, port: 6379});

// Connection
connection.on("connect", () => {
    console.log("Connected to IORedis");
})

// error
connection.on("error", (error) => {
    console.log("Error in IORedis", error);
})


export default connection;
