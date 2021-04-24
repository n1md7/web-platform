import BaseModelMongo from "../BaseModelMongo";
import {AnimalType, CreateNewAnimalType} from "../../types/animal";
import {AnimalSchema, collectionName} from "../../database/mongo/schema/Animal";

export default class AnimalModel extends BaseModelMongo<AnimalType> {
    constructor() {
        super(AnimalSchema, collectionName);
    }

    public async addNewAnimal(param: CreateNewAnimalType): Promise<AnimalType> {
        const animal = new this.model({
            name: param.name,
            type: param.type,
            age: param.age,
            breed: param.breed,
            vaccinated: [{
                name: param.vaccineName,
                date: new Date(2018, 10, 12),
                dose: 123
            }]
        });

        return animal.save();
    }

}