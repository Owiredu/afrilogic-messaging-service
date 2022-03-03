import { DateTime } from 'luxon';
import mongoose from 'mongoose';

interface Message {
    text: string,
    datetime: DateTime,
    sender: mongoose.Types.ObjectId
    channel: mongoose.Types.ObjectId
}

// create user schema
const MessageSchema = new mongoose.Schema<Message>({
    text: { type: String, required: true },
    datetime: { type: Date, required: true, default: () => { return DateTime.now() }},
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channel",
        required: true
    }
});

// create user model
const MessageModel = mongoose.model<Message>("Message", MessageSchema);

// export user model
export default MessageModel;