import {Schema} from "mongoose";

const collectionName = 'animals';
const AnimalSchema = new Schema({
    name: String,
    type: String,
    age: Number,
    breed: String,
    vaccinated: []
});

export {
    AnimalSchema,
    collectionName,
};
