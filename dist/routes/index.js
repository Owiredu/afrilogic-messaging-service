"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-misused-promises */
const express_1 = require("express");
const index_1 = __importDefault(require("@controllers/index"));
// create index router
const indexRouter = (0, express_1.Router)();
// Setup routers
indexRouter.get('/', index_1.default.loadPage);
indexRouter.post('/join', index_1.default.joinChannel);
indexRouter.get('/logout', index_1.default.logout);
// Export default.
exports.default = indexRouter;
