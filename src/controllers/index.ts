/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import ChannelModel from '@models/ChannelModel';
import UserModel from '@models/UserModel';
import Constants from '@utils/constants';


const indexController = {

    /**
     * Loads the join chat page
     */
    loadPage: async function (req: Request, res: Response, next: NextFunction) {
        // load all the channels 
        const channelsData = await ChannelModel.find({});

        // send response to the webpage
        res.render("index", { channelsData: channelsData });
    },

    /**
     * Add a user to a channel and opens the chat section
     */
    joinChannel: async function (req: Request, res: Response, next: NextFunction) {
        // get the form data
        const formData: { username: string, fullname: string, channel: string, existingUser: string } = req.body;
        const username = formData.username.trim();
        const fullname = formData.fullname.trim();
        const channelDocID = formData.channel.trim();
        const existingUser = formData.existingUser.trim() === "false" ? false : true;

        // validate form data
        if (!username.match(Constants.REQUIRED_NAME_REGEX)) {
            res.status(400).send({
                message: "Invalid username"
            });
            return;
        }
        if (channelDocID.match(Constants.EMPTY_STRING_REGEX)) {
            res.status(400).send({
                message: "Invalid channel"
            });
            return;
        }

        // get the selected channel
        const channelDoc = await ChannelModel.findOne({ _id: channelDocID });

        // check whether the channel exists before proceeding
        if (channelDoc) {
            // handle existin users separately from new users
            if (existingUser) {
                const existingUserDoc = await UserModel.findOne({ username: username });
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
                        } else {
                            // update session variables
                            req.session.user = {
                                docID: userDoc._id.toString(),
                                username: userDoc.username,
                                channel: userDoc.channel.toString()
                            };

                            // send success message
                            res.status(200).send({
                                message: "Joined channel successfully"
                            });
                        }
                    });
                } else {
                    // send failure message
                    res.status(400).send({
                        message: "Sorry, this account was not found"
                    });
                }
            } else {
                // validate form data
                if (!fullname.match(Constants.REQUIRED_NAME_REGEX)) {
                    res.status(400).send({
                        message: "Invalid fullname"
                    });
                    return;
                }

                // create a new user model instance
                const newUserDoc = new UserModel({
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
                    } else {
                        // update session variables
                        req.session.user = {
                            docID: userDoc._id.toString(),
                            username: userDoc.username,
                            channel: userDoc.channel.toString()
                        };

                        // send success message
                        res.status(200).send({
                            message: "Joined channel successfully"
                        });
                    }
                });
            }
        } else {
            // send failure message
            res.status(400).send({
                message: "Channel not found"
            });
        }
    },

    /**
     * Logout user
     */
    logout: function (req: Request, res: Response, next: NextFunction) {
        // destroy the session object
        req.session.destroy((err) => null);
        // redirect the browser to the index page
        res.redirect('/');
    }

};

export default indexController;