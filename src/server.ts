/* eslint-disable max-len */
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';


import express, { NextFunction, Request, Response } from 'express';
import StatusCodes from 'http-status-codes';
import 'express-async-errors';

import logger from 'jet-logger';
import { CustomError } from '@shared/errors';

import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import compression from 'compression';
import cors from 'cors';
import { Server as SocketIO } from 'socket.io';
import http from 'http';
import https from 'https';

import dbConfig from '@utils/db_config';

import indexRouter from '@routes/index';
import chatRouter from '@routes/chat';

import chatController from '@controllers/chat';

// define custom session data
declare module 'express-session' {
    interface SessionData {
        user: {
            docID: string,
            username: string,
            channel: {
                id: string,
                name: string
            }
        }
    }
}


// instantiate express app
const app = express();

/***********************************************************************************
 *                                MongoDB Connection
 **********************************************************************************/

// configure mongodb and connect to server
if (process.env.NODE_ENV === 'development') {
    mongoose.connect(
        `mongodb://${dbConfig.offline.hostname}:${dbConfig.offline.port.toString()}/${dbConfig.offline.dbname}`
    );
} else {
    mongoose.connect(
        `mongodb://${dbConfig.online.username}:${dbConfig.online.password}@${dbConfig.online.hostname}/${dbConfig.online.dbname}?authSource=admin&readPreference=primary&directConnection=true`
    );
}

/***********************************************************************************
 *                                  Middlewares
 **********************************************************************************/

// Common middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(compression());

// Show routes called in console during development
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Security (helmet recommended in express docs)
if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
}

// set session
// set the session data
const oneDay = 1000 * 60 * 60 * 24;
app.use(
    session({
        secret: "iwassupposedtobeasecretobeasecretbutiamnotanymore",
        store: MongoStore.create({
            // specify connection string to the mongodb database to store the sessions in
            mongoUrl: process.env.NODE_ENV === 'development' ?
                `mongodb://${dbConfig.offline.hostname}:${dbConfig.offline.port.toString()}/${dbConfig.sessionDb}` :
                `mongodb://${dbConfig.online.username}:${dbConfig.online.password}@${dbConfig.online.hostname}/${dbConfig.sessionDb}?authSource=admin&readPreference=primary&directConnection=true`,
            // remove expired sessions at 10 minutes intervals
            autoRemove: "interval",
            autoRemoveInterval: 10,
            // encrypt session data
            crypto: {
                secret: 'afrilogic'
            }
        }),
        saveUninitialized: true,
        cookie: { maxAge: oneDay },
        resave: false,
    })
);


/***********************************************************************************
 *                                  Front-end content
 **********************************************************************************/

// view engine setup
// Set views dir
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Set static dir
const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));


/***********************************************************************************
 *                         API routes and error handling
 **********************************************************************************/

// Add index router
app.use('/', indexRouter);
app.use('/chat', chatRouter);


// Error handling
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error | CustomError, _: Request, res: Response, __: NextFunction) => {
    logger.err(err, true);
    const status = (err instanceof CustomError ? err.HttpStatus : StatusCodes.BAD_REQUEST);
    return res.status(status).json({
        error: err.message,
    });
});

/************************************************************************************
 *                                   Setup Socket.io
 ***********************************************************************************/

const server = http.createServer(app);
const io = new SocketIO(server);

// handle chat
io.sockets.on('connect', (socket) => {
    // handle chat messages
    socket.on('chat', 
    async (data: {
        senderName: string,
        timestamp: number,
        message: string,
        channelID: string
    }) => {
        // add the message to the database
        await chatController.addNewMessage(data);
        
        // send the message to only people in the channel
        socket.broadcast.emit('chat-' + data.channelID, data);
    });

    // handle typing signals
    socket.on('typing', 
    (data: {
        senderName: string,
        channelID: string
    }) => {
        // send the message to only people in the channel
        socket.broadcast.emit('typing-' + data.channelID, data);
    });

    // handle user disconnection
    socket.on("disconnect", 
    () => {
        console.log("User diconnected");
    });
});


// Export here and start in a diff file (for testing).
export default server;