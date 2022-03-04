"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// create channel schema
const ChannelSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true, index: { unique: true } }
});
// create channel model
const ChannelModel = mongoose_1.default.model("Channel", ChannelSchema);
// export channel model
exports.default = ChannelModel;
