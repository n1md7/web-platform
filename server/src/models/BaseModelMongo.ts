import mongoose, {Document, Schema} from "mongoose";

export default abstract class BaseModelMongo<SchemaType> {

    protected model;

    protected constructor(schema: Schema, name: string | null) {
        this.model = mongoose.model<SchemaType & Document>(name || this.constructor.name, schema);
    }

}