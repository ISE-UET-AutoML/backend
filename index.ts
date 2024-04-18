import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet'
import multer from "multer";
import morgan from "morgan";

import {db} from "./src/api/v1/db";
import config from "./src/config";
import routeV1 from "./src/api/v1/routes/v1";

const app = express()

const apiPrefix = '/api/v1'

db.initialize().then(
    () => {
        console.log("Database initialized");
    }
).catch((err: any) => {
    console.log("Error initializing database", err);
});


app.use(cors(
    {
        origin: config.frontendURL,
        credentials: true
    }
))

app.use(express.json())

app.use(helmet())
app.use(cookieParser())
app.use(bodyParser.json({limit: '100mb'}))
app.use(bodyParser.urlencoded({extended: true, limit: '100mb'}))
app.use(multer().any())
app.use(morgan('tiny'))


app.use(express.static('public'))

app.use(apiPrefix, routeV1)

app.listen(config.port, () => {
    console.log("Server is running on port " + config.port);
})
