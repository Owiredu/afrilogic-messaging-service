/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
import { NextFunction, Request, Response } from 'express';
import UserModel from '@models/UserModel';
import { DateTime } from 'luxon';
import MessageModel from '@models/MessageModel';
import ChannelModel from '@models/ChannelModel';
import Constants from '@utils/constants';


const chatController = {

    loadPage: async function (req: Request, res: Response, next: NextFunction) {
        if (req.session.user?.docID) {
            // load the messages in the selected channel
            const messageDocs = await MessageModel.find({ channel: req.session.user.channel.id }).populate("sender channel");

            // load the members of the selected channel
            const channelMemberDocs = await UserModel.find({ channel: req.session.user.channel.id });

            // send the response to the webpage
            res.render("chat", { session: req.session, messageDocs: messageDocs, channelMemberDocs: channelMemberDocs });
        } else {
            // redirect to join in page
            res.redirect('/');
        }
    },

    /**
     * Add new message to the messages database
     * @param data Data send from use
     */
    addNewMessage: async function(data: {
        senderName: string,
        timestamp: number,
        message: string,
        channelID: string
    }) {
        // get the selected channel
        const channelDoc = await ChannelModel.findOne({ _id: data.channelID });

        if (channelDoc) {
            // get the user document
            const existingUserDoc = await UserModel.findOne({ username: data.senderName });
            
            if (existingUserDoc) {
                const newMessageDoc = new MessageModel({
                    text: data.message,
                    datetime: DateTime.fromJSDate(new Date(data.timestamp)),
                    sender: existingUserDoc._id,
                    channel: channelDoc._id
                });
                // console.log(DateTime.fromJSDate(new Date(data.timestamp)).toFormat("LLL dd yyyy HH:mm"));

                // save the message document
                newMessageDoc.save(function(err, messageDoc) {
                    return;
                });
            }
        }
    },

    addChannel: async function(req: Request, res: Response, next: NextFunction) {
        // get the form data
        const formData: { name: string } = req.body;
        const channelName = formData.name.trim();

        // validate form data
        if (!channelName.match(Constants.REQUIRED_NAME_REGEX)) {
            res.status(400).send({
                message: "Invalid channel name"
            });
            return;
        }

        // check if the channel already exists
        const channelDoc = await ChannelModel.findOne({ name: channelName });

        if (!channelDoc) {
            // create new channel
            const newChannel = new ChannelModel({
                name: channelName
            });

            // save the channel
            newChannel.save(function(err, channelObj) {
                if (err) {
                    // return internal server error from the database
                    res.status(500).send({
                        message: err.message
                    });
                } else {
                    // return internal server error from the database
                    res.status(200).send({
                        message: `'${channelObj.name}' channel added successfully`,
                    });
                }
            });
        } else {
            // send failure message
            res.status(400).send({
                message: "Channel already exists"
            });
        }
    }

};

export default chatController;