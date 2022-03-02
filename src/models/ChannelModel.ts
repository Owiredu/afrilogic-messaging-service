import mongoose from 'mongoose';

interface Channel {
    name: string
}

// create channel schema
const ChannelSchema = new mongoose.Schema<Channel>({
    name: { type: String, required: true, index: { unique: true } }
});

// create channel model
const ChannelModel = mongoose.model<Channel>("Channel", ChannelSchema);

// export channel model
export default ChannelModel;