import { NextFunction, Request, Response } from 'express';
import UserModel from '../models/UserModel';


const indexController = {

    loadPage: async function(req: Request, res: Response, next: NextFunction) {
        res.render("index");
    }

};

export default indexController;