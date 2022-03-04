"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-misused-promises */
const express_1 = require("express");
const chat_1 = __importDefault(require("@controllers/chat"));
// create chat router
const chatRouter = (0, express_1.Router)();
// Setup routers
chatRouter.get('/', chat_1.default.loadPage);
chatRouter.post('/add-channel', chat_1.default.addChannel);
// Export default.
exports.default = chatRouter;
