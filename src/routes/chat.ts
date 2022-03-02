import { Router } from 'express';
import chatController from '@controllers/chat';


// create chat router
const chatRouter = Router();

// Setup routers
chatRouter.get('/', chatController.loadPage);

// Export default.
export default chatRouter;
