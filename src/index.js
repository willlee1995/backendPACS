import cors from "cors";
import consola from 'consola';
import mongoose from "mongoose";
import express from "express";
import { json } from "express";
import passport from "passport";
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
// Import app constants
import {
    DB,
    PORT,
    DOMAIN
} from './constants';

// Router

import userApis from "./apis/users";
import taskApis from "./apis/tasks"

// passport-middleware

require("./middlewares/passport-middleware")

// Init express
const app = express();

// middlewares

app.use(helmet())
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use(json())
app.use(cookieParser())
app.use(passport.initialize())

//Inject Sub router
app.use((req,res,next)=> {
    res.setHeader(
        'Access-Control-Allow-Origin', 'http://localhost:3000'
    )
    next()
})
app.use('/users', userApis)
app.use('/tasks', taskApis)
app.get('/', (req, res) =>{
    res.send('hello')
})
// main
const main = async () => {
    try {
        // Connect to the MongoDB cluster
        await mongoose.connect(
            DB, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            },
        );
        consola.success("DB connected")
        app.listen(PORT||3001, ()=> consola.success(`Server running at ${PORT}`))
    } catch (e) {
        consola.error(`Unable to start the server \n${e.message}`);
    }
}

main()

