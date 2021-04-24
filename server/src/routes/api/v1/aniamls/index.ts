import Router from "@koa/router";
import AnimalController from "../../../../controllers/v1/AnimalController";

const animalRouter = new Router();

animalRouter.post('/animal/new', AnimalController.addNewAnimal);

export default animalRouter;
