import {Router} from 'express';
import productController from './product.controller.js';
import {uploadMiddleware} from '../middleware/multer.middleware.js';


const router = Router();

// Route to create a product
router.post('/create-product', // Authenticate user and attach user info to req.user
    uploadMiddleware('image'),  // Middleware to handle image upload for the product
    productController.createProduct  // Controller method to create a new product
);

// Route to update a product by ID

// Route to retrieve all products with optional pagination
router.get('/get-products', productController.getAllProduct  // Controller method to fetch all products
);

// Route to retrieve a single product by its ID
router.get('/get-product', productController.getProductById  // Controller method to fetch a specific product by its ID
);
// Router to update product due to product id as params
router.put('/update-product/:id', uploadMiddleware('image'), productController.updateProductById)
// Route to delete a product by ID
router.delete('/delete-product/:id', productController.deleteProductById);

export default router;
