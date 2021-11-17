import cors from "cors";
import consola from 'consola';
import mongoose from "mongoose";
import express from "express";
import { json } from "express";
import passport from "passport";
import helmet from 'helmet'
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
app.use(cors());
app.use(json())
app.use(passport.initialize())

//Inject Sub router
app.use('/users', userApis)
app.use('/tasks', taskApis)

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
        app.listen(PORT||3000, ()=> consola.success(`Server running at ${PORT}`))
    } catch (e) {
        consola.error(`Unable to start the server \n${e.message}`);
    }
}

main()

