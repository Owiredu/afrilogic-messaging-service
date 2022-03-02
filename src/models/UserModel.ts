import mongoose from 'mongoose';

interface User {
    username: string,
    fullname: string,
    status: string
}

// create user schema
const UserSchema = new mongoose.Schema<User>({
    username: { type: String, required: true, index: { unique: true } },
    fullname: { type: String, required: true },
    status: { type: String, required: true, enum: ["offline", "online"] }
});

// create user model
const UserModel = mongoose.model<User>("User", UserSchema);

// export user model
export default UserModel;