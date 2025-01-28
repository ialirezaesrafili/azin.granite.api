import autoBind from "auto-bind";
import fs from "fs";
import path from "path";

import ProductModel from "./product.model.js";
import CategoryModel from "../category/category.model.js";
import AuthModel from "../auth/auth.model.js";

class ProductService {
    #userModel;
    #productModel;
    #categoryModel;

    constructor() {
        autoBind(this);
        this.#productModel = ProductModel;
        this.#categoryModel = CategoryModel;
        this.#userModel = AuthModel;
    }

    /**
     * Fetch all products with pagination.
     * @param {Object} options - Pagination options.
     * @param {number} options.page - Current page number.
     * @param {number} options.limit - Number of products per page.
     * @returns {Object} Products and pagination metadata.
     */
    async getAllProduct({page = 1, limit = 10}) {
        try {
            const skip = (page - 1) * limit;

            const [products, totalProducts] = await Promise.all([
                this.#productModel.find({}).skip(skip).limit(limit).lean(),
                this.#productModel.countDocuments({})
            ]);

            return {
                products,
                pagination: {
                    totalProducts,
                    currentPage: page,
                    totalPage: Math.ceil(totalProducts / limit),
                    pageSize: limit,
                },
            };
        } catch (error) {
            console.error(`[ProductService] Error fetching all products: ${error.message}`);
            throw new Error("Failed to fetch products");
        }
    }

    /**
     * Fetch a product by its ID.
     * @param {string} productId - ID of the product to fetch.
     * @returns {Object} Product data.
     */
    async getProductById(productId) {
        try {
            if (!productId) throw new Error("Product ID is required");
            const product = await this.#productModel.findById(productId);
            if (!product) throw new Error("Product not found");
            return product;
        } catch (error) {
            console.error(`[ProductService] Error fetching product by ID: ${error.message}`);
            throw new Error("Failed to fetch product by ID");
        }
    }

    async createProduct({title, description, code, category, size, image, properties, seoWords, colors}) {
        try {
            const [categoryDoc, existingProduct] = await Promise.all([
                this.#categoryModel.findOne({title: category}),
                this.#productModel.findOne({title, code}),
            ]);

            if (!categoryDoc) throw new Error("Category not found");
            if (existingProduct) throw new Error("Product with the same title and code already exists");

            const newProduct = new this.#productModel({
                title,
                description,
                code,
                size: parseFloat(size),
                category: categoryDoc._id,
                image: image || null,
                properties: properties || [],
                seoWords: seoWords || [],
                colors: colors || [],
                isActive: true,
            });

            await newProduct.save();
            return newProduct;
        } catch (error) {
            console.error(`[ProductService] createProduct error: ${error.message}`);
            throw new Error("Failed to create product");
        }
    }

    async updateProductById({
                                productId,
                                title,
                                description,
                                code,
                                category,
                                size,
                                image,
                                properties,
                                seoWords,
                                colors
                            }) {
        try {
            const [existProduct, existCategory] = await Promise.all(
                this.#productModel.findOne({_id: productId}),
                this.#productModel.findOne({title: title})
            );

            if (!existProduct) throw new Error('Category does not found !');
            if (!existCategory) throw new Error('Category does not found !');

            if (image && existProduct.image) this.deleteFile(path.basename(existProduct.image));

            const updateProduct = await this.#productModel.findByIdAndUpdate(
                productId, {
                    title,
                    description,
                    code,
                    category,
                    size,
                    image,
                    properties,
                    seoWords,
                    colors
                },
                {new: true}
            )

            return updateProduct;


        } catch (error) {
            console.error(`[ProductService] updateProduct error: ${error.message}`);
            throw new Error("Failed to create product");
        }
    }

    async deleteProductById(productId) {
        try {
            const product = await this.#productModel.findById(productId);
            if (!product) throw new Error("Product id not found");
            if (product.image) this.deleteFile(path.basename(product.image));
            const deleteProduct = await this.#productModel.findByIdAndDelete(productId);
            return deleteProduct;
        } catch (error) {
            console.error(`[ProductService] Error fetching product by ID: ${error.message}`);
            throw new Error("Failed to fetch product by ID");
        }
    }

    deleteFile(filename) {
        const uploadDir = path.resolve("uploads");
        const filePath = path.join(uploadDir, filename);

        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log(`[ProductService] File "${filename}" deleted successfully.`);
            } else {
                console.log(`[ProductService] File "${filename}" does not exist.`);
            }
        } catch (error) {
            console.error(`[ProductService] Error deleting file "${filename}": ${error.message}`);
            throw new Error("Failed to delete file");
        }
    }
}

const productService = new ProductService();

export default productService;
