/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import chatController from '@controllers/chat';


// create chat router
const chatRouter = Router();

// Setup routers
chatRouter.get('/', chatController.loadPage);

chatRouter.post('/add-channel', chatController.addChannel);

// Export default.
export default chatRouter;
