import { NextFunction, Request, Response } from 'express';


const indexController = {

    loadPage: async function(req: Request, res: Response, next: NextFunction) {
        res.render("index");
    }

};

export default indexController;