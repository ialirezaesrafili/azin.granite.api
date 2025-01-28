import {Router} from 'express';
import AuthRouter from "./src/auth/auth.router.js";
import CategoryRouter from "./src/category/category.router.js";
import ProductRouter from "./src/product/product.router.js";


// router for all api

const router = Router();

router.use('/auth', AuthRouter);
router.use('/category', CategoryRouter);
router.use('/product', ProductRouter)
export default router;
