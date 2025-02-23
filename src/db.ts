import mongoose, { model, Schema } from "mongoose";
import { MONGODB_STRING } from "./config";

mongoose.connect(MONGODB_STRING);


const UserSchema = new Schema({
    username: {type: String, unique: true},
    password: String
})

export const UserModel = model("User", UserSchema);

const ContentSchema = new Schema({
    title: String,
    link: String,
    tags: [{type: mongoose.Types.ObjectId, ref: 'Tag'}],
    userId: {type: mongoose.Types.ObjectId, ref: 'User', require:true}
})

export const ContentModel = model("Content", ContentSchema);