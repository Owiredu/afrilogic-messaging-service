import { Router } from 'express';
import indexController from '../controllers/index';


// Export the base-router
const indexRouter = Router();

// Setup routers
indexRouter.use('/', indexController.loadPage);

// Export default.
export default indexRouter;
