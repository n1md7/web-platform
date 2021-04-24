import Router from '@koa/router';
import {Context} from 'koa';

const productRouter = new Router();

productRouter.get('/products', (ctx: Context) => {
    ctx.body = ['apple', 'samsung', 'lenovo'];
});

productRouter.get('/product', (ctx: Context) => {
    ctx.body = {
        dummyText: "Boreas, bursa, et species."
    };
});

export default productRouter;
