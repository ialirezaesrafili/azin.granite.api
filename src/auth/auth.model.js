import mongoose, { Schema } from 'mongoose';

const authSchema = new Schema(
    {
        username: { type: String, unique: true },
        name: { type: String, default: null },
        lastname: { type: String, default: null },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ['admin', 'user'], default: 'user' },
        isLoggedIn: { type: Boolean, default: false },
        token: { type: String, default: '' },
    },
    { timestamps: true }
);

const authModel = mongoose.model('Auth', authSchema);
export default authModel;
