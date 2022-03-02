import { Router } from 'express';
import indexController from '@controllers/index';


// create index router
const indexRouter = Router();

// Setup routers
indexRouter.get('/', indexController.loadPage);

// Export default.
export default indexRouter;
