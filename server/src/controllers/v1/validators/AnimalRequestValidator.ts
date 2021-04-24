import Joi from 'joi';

export const createAnimalSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(16)
        .required(),
    type: Joi.string()
        .min(2)
        .max(16)
        .required(),
    age: Joi.number().required(),
    breed: Joi.string().required(),
    vaccineName: Joi.string().required(),
});