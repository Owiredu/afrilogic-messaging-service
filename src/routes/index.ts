import { Router } from 'express';
import indexController from '@controllers/index';


// create index router
const indexRouter = Router();

// Setup routers
// eslint-disable-next-line @typescript-eslint/no-misused-promises
indexRouter.get('/', indexController.loadPage);

indexRouter.post('/join', indexController.joinChannel);

// Export default.
export default indexRouter;
