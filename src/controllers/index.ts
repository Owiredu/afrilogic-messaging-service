import { NextFunction, Request, Response } from 'express';
import ChannelModel from '@models/ChannelModel';


const indexController = {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    loadPage: async function(req: Request, res: Response, next: NextFunction) {
        // load all the channels 
        const channelsData = await ChannelModel.find({});

        // send response to the webpage
        res.render("index", { channelsData: channelsData });
    }

};

export default indexController;