"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable max-len */
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const helmet_1 = __importDefault(require("helmet"));
const express_1 = __importDefault(require("express"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
require("express-async-errors");
const jet_logger_1 = __importDefault(require("jet-logger"));
const errors_1 = require("@shared/errors");
const mongoose_1 = __importDefault(require("mongoose"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const express_session_1 = __importDefault(require("express-session"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
const https_1 = __importDefault(require("https"));
const db_config_1 = __importDefault(require("@utils/db_config"));
const index_1 = __importDefault(require("@routes/index"));
const chat_1 = __importDefault(require("@routes/chat"));
const chat_2 = __importDefault(require("@controllers/chat"));
// instantiate express app
const app = (0, express_1.default)();
/***********************************************************************************
 *                                MongoDB Connection
 **********************************************************************************/
// configure mongodb and connect to server
if (process.env.NODE_ENV === 'development') {
    mongoose_1.default.connect(`mongodb://${db_config_1.default.offline.hostname}:${db_config_1.default.offline.port.toString()}/${db_config_1.default.offline.dbname}`);
}
else {
    mongoose_1.default.connect(`mongodb+srv://${db_config_1.default.online.username}:${db_config_1.default.online.password}@${db_config_1.default.online.hostname}/${db_config_1.default.online.dbname}?retryWrites=true&w=majority`);
}
/***********************************************************************************
 *                                  Middlewares
 **********************************************************************************/
// Common middlewares
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)());
app.use((0, compression_1.default)());
// Show routes called in console during development
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
// Security (helmet recommended in express docs)
if (process.env.NODE_ENV === 'production') {
    app.use((0, helmet_1.default)());
}
// set session
// set the session data
const oneDay = 1000 * 60 * 60 * 24;
app.use((0, express_session_1.default)({
    secret: "iwassupposedtobeasecretobeasecretbutiamnotanymore",
    store: connect_mongo_1.default.create({
        // specify connection string to the mongodb database to store the sessions in
        mongoUrl: process.env.NODE_ENV === 'development' ?
            `mongodb://${db_config_1.default.offline.hostname}:${db_config_1.default.offline.port.toString()}/${db_config_1.default.sessionDb}` :
            `mongodb+srv://${db_config_1.default.online.username}:${db_config_1.default.online.password}@${db_config_1.default.online.hostname}/${db_config_1.default.sessionDb}?retryWrites=true&w=majority`,
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
}));
/***********************************************************************************
 *                                  Front-end content
 **********************************************************************************/
// view engine setup
// Set views dir
app.set("views", path_1.default.join(__dirname, "views"));
app.set("view engine", "ejs");
// Set static dir
const staticDir = path_1.default.join(__dirname, 'public');
app.use(express_1.default.static(staticDir));
/***********************************************************************************
 *                         API routes and error handling
 **********************************************************************************/
// Add index router
app.use('/', index_1.default);
app.use('/chat', chat_1.default);
// Error handling
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err, _, res, __) => {
    jet_logger_1.default.err(err, true);
    const status = (err instanceof errors_1.CustomError ? err.HttpStatus : http_status_codes_1.default.BAD_REQUEST);
    return res.status(status).json({
        error: err.message,
    });
});
/************************************************************************************
 *                                   Setup Socket.io
 ***********************************************************************************/
const server = https_1.default.createServer(app);
const io = new socket_io_1.Server(server);
// handle chat
io.sockets.on('connect', (socket) => {
    // handle chat messages
    socket.on('chat', (data) => __awaiter(void 0, void 0, void 0, function* () {
        // add the message to the database
        yield chat_2.default.addNewMessage(data);
        // send the message to only people in the channel
        socket.broadcast.emit('chat-' + data.channelID, data);
    }));
    // handle typing signals
    socket.on('typing', (data) => {
        // send the message to only people in the channel
        socket.broadcast.emit('typing-' + data.channelID, data);
    });
    // handle user disconnection
    socket.on("disconnect", () => {
        // console.log("User diconnected");
    });
});
// Export here and start in a diff file (for testing).
exports.default = server;
