import cors from "cors";
import consola from 'consola';
import mongoose from "mongoose";
import express from "express";
import { json } from "express";
// Import app constants
import {
    DB,
    PORT,
    DOMAIN
} from './constants';


// Router

import userApis from "./apis/users";

// Init express
const app = express();

// middlewares

app.use(cors());
app.use(json())

//Inject Sub router
app.use('/users', userApis)
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
        app.listen(PORT, ()=> consola.success(`Server running at ${DOMAIN}`))
    } catch (e) {
        consola.error(`Unable to start the server \n${err.message}`);
    }
}

main()

