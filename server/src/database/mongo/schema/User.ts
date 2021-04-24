import {Schema} from "mongoose";

const collectionName = 'users';
const UserSchema = new Schema({
    username: String,
    password: String,
    status: String
});

export {
    UserSchema,
    collectionName,
};
