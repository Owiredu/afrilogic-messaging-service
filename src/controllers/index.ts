import { NextFunction, Request, Response } from 'express';
import ChannelModel from '@models/ChannelModel';


const indexController = {

    /**
     * Loads the join chat page
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    loadPage: async function(req: Request, res: Response, next: NextFunction) {
        // load all the channels 
        const channelsData = await ChannelModel.find({});

        // send response to the webpage
        res.render("index", { channelsData: channelsData });
    },

    /**
     * Add a user to a channel and opens the chat section
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    joinChannel: function(req: Request, res: Response, next: NextFunction) {
        res.send({
            message: "Joined channel successfully"
        });
    }

};

export default indexController;