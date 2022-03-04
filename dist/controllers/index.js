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
const ChannelModel_1 = __importDefault(require("@models/ChannelModel"));
const UserModel_1 = __importDefault(require("@models/UserModel"));
const constants_1 = __importDefault(require("@utils/constants"));
const indexController = {
    /**
     * Loads the join chat page
     */
    loadPage: function (req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // load all the channels 
            const channelsData = yield ChannelModel_1.default.find({});
            // send response to the webpage
            res.render("index", { channelsData: channelsData });
        });
    },
    /**
     * Add a user to a channel and opens the chat section
     */
    joinChannel: function (req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // get the form data
            const formData = req.body;
            const username = formData.username.trim();
            const fullname = formData.fullname.trim();
            const channelDocID = formData.channel.trim();
            const existingUser = formData.existingUser.trim() === "false" ? false : true;
            // validate form data
            if (!username.match(constants_1.default.REQUIRED_NAME_REGEX)) {
                res.status(400).send({
                    message: "Invalid username"
                });
                return;
            }
            if (channelDocID.match(constants_1.default.EMPTY_STRING_REGEX)) {
                res.status(400).send({
                    message: "Invalid channel"
                });
                return;
            }
            // get the selected channel
            const channelDoc = yield ChannelModel_1.default.findOne({ _id: channelDocID });
            // check whether the channel exists before proceeding
            if (channelDoc) {
                // handle existin users separately from new users
                if (existingUser) {
                    const existingUserDoc = yield UserModel_1.default.findOne({ username: username });
                    if (existingUserDoc) {
                        // update user data
                        existingUserDoc.status = "online";
                        existingUserDoc.channel = channelDoc._id;
                        // update the user document
                        existingUserDoc.save(function (err, userDoc) {
                            if (err) {
                                // return internal server error from the database
                                res.status(500).send({
                                    message: err.message
                                });
                            }
                            else {
                                // update session variables
                                req.session.user = {
                                    docID: userDoc._id.toString(),
                                    username: userDoc.username,
                                    channel: {
                                        id: channelDoc._id.toString(),
                                        name: channelDoc.name
                                    }
                                };
                                // send success message
                                res.status(200).send({
                                    message: "Joined channel successfully"
                                });
                            }
                        });
                    }
                    else {
                        // send failure message
                        res.status(400).send({
                            message: "Sorry, this account was not found"
                        });
                    }
                }
                else {
                    // validate form data
                    if (!fullname.match(constants_1.default.REQUIRED_NAME_REGEX)) {
                        res.status(400).send({
                            message: "Invalid fullname"
                        });
                        return;
                    }
                    // create a new user model instance
                    const newUserDoc = new UserModel_1.default({
                        username: username,
                        fullname: fullname,
                        status: "online",
                        channel: channelDoc._id
                    });
                    // save the user document
                    newUserDoc.save(function (err, userDoc) {
                        if (err) {
                            // return internal server error from the database
                            res.status(500).send({
                                message: err.message
                            });
                        }
                        else {
                            // update session variables
                            req.session.user = {
                                docID: userDoc._id.toString(),
                                username: userDoc.username,
                                channel: {
                                    id: channelDoc._id.toString(),
                                    name: channelDoc.name
                                }
                            };
                            // send success message
                            res.status(200).send({
                                message: "Joined channel successfully"
                            });
                        }
                    });
                }
            }
            else {
                // send failure message
                res.status(400).send({
                    message: "Channel not found"
                });
            }
        });
    },
    /**
     * Logout user
     */
    logout: function (req, res, next) {
        // destroy the session object
        req.session.destroy((err) => null);
        // redirect the browser to the index page
        res.redirect('/');
    }
};
exports.default = indexController;
