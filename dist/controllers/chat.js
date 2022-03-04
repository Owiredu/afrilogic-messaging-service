"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserModel_1 = __importDefault(require("@models/UserModel"));
const luxon_1 = require("luxon");
const MessageModel_1 = __importDefault(require("@models/MessageModel"));
const ChannelModel_1 = __importDefault(require("@models/ChannelModel"));
const chatController = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    loadPage: function (req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if ((_a = req.session.user) === null || _a === void 0 ? void 0 : _a.docID) {
                // load the messages in the selected channel
                const messageDocs = yield MessageModel_1.default.find({ channel: req.session.user.channel.id }).populate("sender channel");
                // load the members of the selected channel
                const channelMemberDocs = yield UserModel_1.default.find({ channel: req.session.user.channel.id });
                // send the response to the webpage
                res.render("chat", { session: req.session, messageDocs: messageDocs, channelMemberDocs: channelMemberDocs });
            }
            else {
                // redirect to join in page
                res.redirect('/');
            }
        });
    },
    /**
     * Add new message to the messages database
     * @param data Data send from use
     */
    addNewMessage: function (data) {
        return __awaiter(this, void 0, void 0, function* () {
            // get the selected channel
            const channelDoc = yield ChannelModel_1.default.findOne({ _id: data.channelID });
            if (channelDoc) {
                // get the user document
                const existingUserDoc = yield UserModel_1.default.findOne({ username: data.senderName });
                if (existingUserDoc) {
                    const newMessageDoc = new MessageModel_1.default({
                        text: data.message,
                        datetime: luxon_1.DateTime.fromJSDate(new Date(data.timestamp)),
                        sender: existingUserDoc._id,
                        channel: channelDoc._id
                    });
                    // console.log(DateTime.fromJSDate(new Date(data.timestamp)).toFormat("LLL dd yyyy HH:mm"));
                    // save the message document
                    newMessageDoc.save(function (err, messageDoc) {
                        return;
                    });
                }
            }
        });
    }
};
exports.default = chatController;
