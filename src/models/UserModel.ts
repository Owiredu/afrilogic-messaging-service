import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const SALT_WORK_FACTOR = 5;

// create user schema
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, index: { unique: true } },
    fullname: { type: String, required: true },
    status: { type: String, required: true, enum: ["offline", "online"] },
    password: { type: String, required: true }
});

UserSchema.pre("save", function (next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, async function (err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, async function (err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function (candidatePassword: string|Buffer, cb: CallableFunction) {
    bcrypt.compare(candidatePassword, this.password, async function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

// create user model
const UserModel = mongoose.model("User", UserSchema);

// export user model
export default UserModel;