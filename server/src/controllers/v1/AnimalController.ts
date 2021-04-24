import BaseController from './BaseController';
import {Context} from 'koa';
import AnimalModel from "../../models/mongo/AnimalModel";
import {createAnimalSchema} from './validators/AnimalRequestValidator';

class AnimalController extends BaseController {

    public async addNewAnimal(ctx: Context): Promise<void> {
        const validation = createAnimalSchema.validate(ctx.request.body);
        if (validation.error) {
            throw new Error(validation.error.details.pop().message);
        }
        const model = new AnimalModel();
        ctx.body = await model.addNewAnimal(validation.value);
    }

}

export default new AnimalController;
