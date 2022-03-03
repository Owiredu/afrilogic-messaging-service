import { NextFunction, Request, Response } from 'express';
import UserModel from '@models/UserModel';


const chatController = {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    loadPage: function (req: Request, res: Response, next: NextFunction) {
        if (req.session.user?.docID) {
            // send the response to the webpage
            res.render("chat", { session: req.session });
        } else {
            // redirect to join in page
            res.redirect('/');
        }
    }

};

export default chatController;