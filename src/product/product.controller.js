import autoBind from "auto-bind";
import productService from "./product.service.js";
import httpStatusCodes from "http-status-codes";
import mongoose from "mongoose";

class ProductController {
    #productService;

    constructor() {
        autoBind(this); // Automatically bind methods to the class instance
        this.#productService = productService; // Initialize the product service
    }

    /**
     * Get a list of all products with pagination.
     * @param {object} req - Express request object.
     * @param {object} res - Express response object.
     * @param {function} next - Express next middleware function.
     */
    async getAllProduct(req, res, next) {
        try {
            const {page = 1} = req.query; // Default to page 1 if not specified
            const limit = 10; // Fixed limit of 10 items per page

            const {products, pagination} = await this.#productService.getAllProduct({
                page: Number(page),
                limit,
            });

            return res.status(httpStatusCodes.OK).json({
                status: httpStatusCodes.OK,
                message: "Products retrieved successfully",
                data: products,
                pagination,
            });
        } catch (error) {
            next(error.message); // Pass error to the global error handler
        }
    }

    /**
     * Get details of a single product by its ID.
     * @param {object} req - Express request object.
     * @param {object} res - Express response object.
     * @param {function} next - Express next middleware function.
     */
    async getProductById(req, res, next) {
        try {
            const {id: productId} = req.query;

            if (!productId) {
                return res.status(httpStatusCodes.BAD_REQUEST).json({
                    message: "Product ID is required",
                });
            }

            const product = await this.#productService.getProductById(productId);

            return res.status(httpStatusCodes.OK).json({
                message: "Product retrieved successfully",
                data: product,
            });
        } catch (error) {
            console.error(`[ProductController] getProductById error: ${error.message}`);
            next(error.message);
        }
    }

    async createProduct(req, res, next) {
        try {
            const {
                title,
                description,
                code,
                category,
                size,
                properties,
                seoWords,
                colors,
            } = req.body;

            // Extract the file path if an image is uploaded
            const image = req.file ? req.file.path : null;

            // Log the incoming request body for debugging
            console.log("Received request body:", req.body);

            // Handle cases where properties, seoWords, or colors might be empty or malformed
            let parsedProperties = [];
            let parsedSeoWords = [];
            let parsedColors = [];

            try {
                // Parse JSON strings if they are provided; otherwise, use defaults
                parsedProperties = properties ? JSON.parse(properties) : [];
            } catch (error) {
                console.error("Error parsing properties:", error.message);
            }

            try {
                parsedSeoWords = seoWords ? JSON.parse(seoWords) : [];
            } catch (error) {
                console.error("Error parsing seoWords:", error.message);
            }

            try {
                parsedColors = colors ? JSON.parse(colors) : [];
            } catch (error) {
                console.error("Error parsing colors:", error.message);
            }


            // Call the ProductService to handle product creation
            const newProduct = await this.#productService.createProduct({
                title,
                description,
                code,
                category,
                size,
                image,
                properties: parsedProperties,
                seoWords: parsedSeoWords,
                colors: parsedColors,
            });

            return res.status(httpStatusCodes.CREATED).json({
                status: httpStatusCodes.CREATED,
                message: "Product created successfully",
                data: newProduct,
            });
        } catch (error) {
            console.error(`[ProductController] createProduct error: ${error.message}`);
            next(error);
        }
    }

    async updateProductById(req, res, next) {
        try {
            const {id: productId} = req.params;
            const {title, description, code, category, size, properties, colors, seoWords} = req.body;
            const image = req.file ?? req.file?.path;

            if (!productId) {
                return res.status(httpStatusCodes.BAD_REQUEST).json({
                    message: "Missing product id or it doest not exist"
                })
            }
            const product = await this.#productService.getProductById(productId);

            if (!product) throw new Error('Product not found');

            let parsedProperties = [];
            let parsedSeoWords = [];
            let parsedColors = [];

            try {
                // Parse JSON strings if they are provided; otherwise, use defaults
                parsedProperties = properties ? JSON.parse(properties) : [];
            } catch (error) {
                console.error("Error parsing properties:", error.message);
            }

            try {
                parsedSeoWords = seoWords ? JSON.parse(seoWords) : [];
            } catch (error) {
                console.error("Error parsing seoWords:", error.message);
            }

            try {
                parsedColors = colors ? JSON.parse(colors) : [];
            } catch (error) {
                console.error("Error parsing colors:", error.message);
            }


            const updateProduct = await this.#productService.updateProductById({
                productId,
                title,
                description,
                code,
                category,
                size,
                image,
                seoWords: parsedSeoWords,
                properties:
                parsedProperties,
                colors:
                parsedColors,
            })

            return res.status(httpStatusCodes.OK).json({
                message: "Product updated successfully",
                data: updateProduct
            })

        } catch (error) {
            console.error(`[ProductController] updateProduct error: ${error.message}`);
            next(error);
        }
    }

    async deleteProductById(req, res, next) {
        try {
            const {id: productId} = req.params;
            if (!mongoose.isValidObjectId(productId)) {
                return res.status(httpStatusCodes.BAD_REQUEST).json({
                    message: "id is validation "
                })
            }

            const product = await this.#productService.deleteProductById(productId);

            if (!product) {
                return res.status(httpStatusCodes.BAD_REQUEST).json({
                    message: "product not found"
                })
            }

            return res.status(httpStatusCodes.OK).json({
                message: "Product deleted successfully",
                data: product
            })

        } catch (error) {
            console.error(`[ProductController] delete product error: ${error.message}`);
            next(error);
        }
    }

}

const productController = new ProductController();

export default productController;
