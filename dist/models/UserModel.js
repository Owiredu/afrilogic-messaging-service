"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// create user schema
const UserSchema = new mongoose_1.default.Schema({
    username: { type: String, required: true, index: { unique: true } },
    fullname: { type: String, required: true },
    status: { type: String, required: true, enum: ["offline", "online"] },
    channel: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Channel",
        required: true
    }
});
// create user model
const UserModel = mongoose_1.default.model("User", UserSchema);
// export user model
exports.default = UserModel;
