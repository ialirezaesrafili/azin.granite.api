import {Router} from 'express';
import categoryController from "./category.controller.js";
import {uploadMiddleware} from "../middleware/multer.middleware.js";

const router = Router();

// Router  create Category
router.post('/create-category',
    uploadMiddleware('icon'), categoryController.createCategory);

// Router get Categories
router.get('/get-categories', categoryController.getCategories);
router.get('/get-category/:id', categoryController.getCategoryById);

// filter category due to title
router.get('/filter-category', categoryController.filterCategory);
// Router update Category
router.put('/update-category/:id',
    uploadMiddleware('icon'),
    categoryController.updateCategoryById);

// Router delete Category by id

router.delete('/delete-category/:id',
    categoryController.deleteCategoryById);

export default router;