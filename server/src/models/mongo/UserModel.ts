import BaseModelMongo from "../BaseModelMongo";
import {UserType} from "../../types/user";
import {UserSchema, collectionName} from "../../database/mongo/schema/User";

export default class UserModel extends BaseModelMongo<UserType> {
    constructor() {
        super(UserSchema, collectionName);
    }

    public async getAllUsers(): Promise<UserType[]> {
        return this.model.find({});
    }
}