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
import dbConfig from '@shared/db_config';

import indexRouter from '@routes/index';
import chatRouter from '@routes/chat';


// Constants
const app = express();

/***********************************************************************************
 *                                MongoDB Connection
 **********************************************************************************/

// configure mongodb and connect to server
if (process.env.NODE_ENV === 'development') {
    mongoose.connect(
        // eslint-disable-next-line max-len
        `mongodb://${dbConfig.offline.hostname}:${dbConfig.offline.port.toString()}/${dbConfig.offline.dbname}`
    );
} else {
    mongoose.connect(
        // eslint-disable-next-line max-len
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

// Show routes called in console during development
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Security (helmet recommended in express docs)
if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
}


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


// Export here and start in a diff file (for testing).
export default app;