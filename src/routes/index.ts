/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import indexController from '@controllers/index';


// create index router
const indexRouter = Router();

// Setup routers
indexRouter.get('/', indexController.loadPage);

indexRouter.post('/join', indexController.joinChannel);

indexRouter.get('/logout', indexController.logout);

// Export default.
export default indexRouter;
