import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';

import express, { NextFunction, Request, Response } from 'express';
import StatusCodes from 'http-status-codes';
import 'express-async-errors';

import logger from 'jet-logger';
import { CustomError } from '@shared/errors';

import indexRouter from './routes/index';


// Constants
const app = express();


/***********************************************************************************
 *                                  Middlewares
 **********************************************************************************/

// Common middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
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


// Error handling
app.use((err: Error | CustomError, _: Request, res: Response, __: NextFunction) => {
    logger.err(err, true);
    const status = (err instanceof CustomError ? err.HttpStatus : StatusCodes.BAD_REQUEST);
    return res.status(status).json({
        error: err.message,
    });
});


// Export here and start in a diff file (for testing).
export default app;