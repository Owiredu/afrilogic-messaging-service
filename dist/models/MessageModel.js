"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const luxon_1 = require("luxon");
const mongoose_1 = __importDefault(require("mongoose"));
// create user schema
const MessageSchema = new mongoose_1.default.Schema({
    text: { type: String, required: true },
    datetime: { type: Date, required: true, default: () => { return luxon_1.DateTime.now(); } },
    sender: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    channel: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Channel",
        required: true
    }
});
// create user model
const MessageModel = mongoose_1.default.model("Message", MessageSchema);
// export user model
exports.default = MessageModel;
