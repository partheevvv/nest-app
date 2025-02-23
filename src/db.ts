import mongoose, { Model, model, Schema } from "mongoose";
import { MONGODB_STRING } from "./config";

interface IUser extends Document {
    _id: string;
    username: string;
    password: string;
}

const UserSchema: Schema<IUser> = new Schema<IUser>({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
})

const UserModel: Model<IUser> = model<IUser>("User", UserSchema);

const connectDB = async (): Promise<void> => {
    try{
        await mongoose.connect(MONGODB_STRING);
        console.log("Connected to database");
    } catch(e) {
        console.error("Failed to connect to database");
        process.exit(1);
    }
};
    
const ContentSchema = new Schema({
    title: String,
    link: String,
    tags: [{type: mongoose.Types.ObjectId, ref: 'Tag'}],
    userId: {type: mongoose.Types.ObjectId, ref: 'User', require:true}
})

export const ContentModel = model("Content", ContentSchema);

export { UserModel, connectDB, IUser };