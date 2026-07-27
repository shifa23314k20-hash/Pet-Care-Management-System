import { Schema, model } from "mongoose";

const UserSchema = new Schema(
    {
        id: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        phone: { type: String, },
        profileImage: { type: String, },
        bio: { type: String, },
        location: { type: String },
        otp: {type: String,default: ""},
        otpExpiry: {type: Date,default: null},
    },
    { timestamps: true }
);

const User = model("User", UserSchema);
export default User;