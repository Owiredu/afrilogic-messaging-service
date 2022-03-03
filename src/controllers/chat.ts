/* eslint-disable max-len */
import { NextFunction, Request, Response } from 'express';
import UserModel from '@models/UserModel';
import { DateTime } from 'luxon';
import MessageModel from '@models/MessageModel';
import ChannelModel from '@models/ChannelModel';


const chatController = {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    loadPage: async function (req: Request, res: Response, next: NextFunction) {
        if (req.session.user?.docID) {
            // load the messages in the selected channel
            const messageDocs = await MessageModel.find({ channel: req.session.user.channel.id }).populate("sender channel");

            // send the response to the webpage
            res.render("chat", { session: req.session, messageDocs: messageDocs });
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
    }

};

export default chatController;