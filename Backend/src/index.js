const express = require('express')
const app = express();
require('dotenv').config();
const main =  require('./config/db')
const cookieParser =  require('cookie-parser');
const authRouter = require("./routes/userAuth");
const redisClient = require('./config/redis');
const problemRouter = require("./routes/problemCreator");
const submitRouter = require("./routes/submit")
const aiRouter = require("./routes/aiChatting")
const videoRouter = require("./routes/videoCreator");
const editorialRouter = require("./routes/editorialRoutes");
const cors = require('cors')

// console.log("Hello")

app.use(cors({
    // origin: process.env.FRONTEND_URL,
    origin:"http://localhost:5173",
    credentials: true 
}))

app.use(express.json());
app.use(cookieParser());

app.use('/user',authRouter);
app.use('/problem',problemRouter);
app.use('/submission',submitRouter);
app.use('/ai',aiRouter);
app.use("/video",videoRouter);
app.use("/editorial", editorialRouter);


const InitalizeConnection = async ()=>{
    try{
        console.log("Connecting to MongoDB...");
        await main();
        console.log("MongoDB connected successfully.");

        console.log("Connecting to Redis...");
        await redisClient.connect();
        console.log("Redis connected successfully.");

        const PORT = process.env.PORT || 3000;
        app.listen(process.env.PORT, ()=>{
            console.log("Server listening at port number: "+ process.env.PORT);
        });
    }
    catch(err){
        console.log("Error: "+err);
    }
}


InitalizeConnection();

