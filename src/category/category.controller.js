import autoBind from "auto-bind";
import categoryService from "./category.service.js";
import httpStatusCodes from "http-status-codes";
import mongoose from "mongoose";

class CategoryController {
    #categoryService;

    constructor() {
        autoBind(this);
        this.#categoryService = categoryService;
    }

    /**
     * Create a new category
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async createCategory(req, res, next) {
        try {
            const {title, description, seoWords} = req.body;
            const icon = req.file ? req.file?.path : null;

            // Validate the title
            if (!title || typeof title !== "string") {
                return res.status(httpStatusCodes.BAD_REQUEST).json({
                    message: "Category title is required and must be a string.",
                });
            }
            let parsedSeoWords = [];
            if (seoWords) {
                try {
                    // Attempt to parse seoWords as JSON
                    parsedSeoWords = Array.isArray(seoWords)
                        ? seoWords
                        : JSON.parse(seoWords);
                } catch (error) {
                    return res.status(httpStatusCodes.BAD_REQUEST).json({
                        message: "Invalid format for seoWords. It must be a JSON array.",
                    });
                }
            }
            // Await the result from the service layer

            const category = await this.#categoryService.createCategory({
                title,
                icon,
                description,
                seoWords: parsedSeoWords
            });


            return res.status(httpStatusCodes.CREATED).json({
                message: "Category successfully created.",
                data: category,
            });
        } catch (error) {
            console.error(`[CategoryController] Error creating category: ${error.message}`, {
                requestBody: req.body,
                file: req.file,
            });
            next(error);
        }
    }

    /**
     * Retrieve all categories
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async getCategories(req, res, next) {
        try {
            const categories = await this.#categoryService.getCategories();

            if (!categories || categories.length === 0) {
                return res.status(httpStatusCodes.NOT_FOUND).json({
                    message: "No categories found.",
                });
            }

            return res.status(httpStatusCodes.OK).json({
                message: "Categories retrieved successfully.",
                data: categories,
            });
        } catch (error) {
            console.error(`[CategoryController] Error retrieving categories: ${error.message}`);
            next(error);
        }
    }

    async getCategoryById(req, res, next) {
        try {
            const {id: catId} = req.params;
            const category = await this.#categoryService.getCategoryById(catId);
            if (!category) {
                return res.status(httpStatusCodes.BAD_REQUEST).json({
                    message: "Category not found",
                })
            }
            return res.status(httpStatusCodes.OK).json({
                message: "Category retrieved successfully.",
                data: category,
            })
        } catch (error) {
            console.error(`[CategoryController] Error retrieving categories: ${error.message}`);
            next(error);
        }
    }

    async filterCategory(req, res, next) {
        try {
            const {title} = req.query;
            if (!title || typeof title !== "string") {
                return res.status(httpStatusCodes.BAD_REQUEST).json(
                    {message: "missing title query"}
                )
            }
            const category = await this.#categoryService.filterCategory(title);
            if (!category) {
                return res.status(httpStatusCodes.BAD_REQUEST).json({
                    message: "category not found"
                })
            }

            return res.status(httpStatusCodes.OK).json({
                message: "retrieving category successfully ",
                data: {
                    _id: category._id,
                    title: category.title
                }
            })
        } catch (error) {
            console.error(`[CategoryController] Error retrieving categories: ${error.message}`);
            next(error);
        }
    }

    async updateCategoryById(req, res, next) {
        try {
            const {title, description, seoWords, isActive} = req.body;
            const {id: catId} = req.params;

            // Check if catId is a valid ObjectId
            if (!mongoose.Types.ObjectId.isValid(catId)) {
                return res.status(httpStatusCodes.BAD_REQUEST).json({
                    message: "Invalid category ID format."
                });
            }

            const icon = req.file ? req.file?.path : null;

            // Validation for missing category ID or invalid fields
            if (!catId) {
                return res.status(httpStatusCodes.BAD_REQUEST).json({
                    message: "Missing param for category",
                });
            }

            if (typeof title !== "string") {
                return res.status(httpStatusCodes.BAD_REQUEST).json({
                    message: "Invalid format for category title"
                });
            }

            let parsedSeoWords = seoWords ? JSON.parse(seoWords) : [];

            // Call the service to update the category
            const category = await this.#categoryService.updateCategoryById({
                catId,
                title,
                description,
                icon,
                seoWords: parsedSeoWords,
                isActive
            });

            return res.status(httpStatusCodes.OK).json({
                message: "Category updated successfully",
                data: category
            });

        } catch (error) {
            console.error(`[CategoryController] Error updating category by id: ${error.message}`);
            next(error);
        }
    }

    async deleteCategoryById(req, res, next) {
        try {
            const { id: catId } = req.params;

            if (!mongoose.Types.ObjectId.isValid(catId)) {
                return res.status(httpStatusCodes.BAD_REQUEST).json({
                    message: "Invalid category ID format."
                });
            }

            const cat = await this.#categoryService.deleteCategoryById(catId);

            if (!cat) {
                return res.status(httpStatusCodes.NOT_FOUND).json({
                    message: "Category not found"
                });
            }

            return res.status(httpStatusCodes.OK).json({
                message: "Category deleted successfully",
                data: cat
            });
        } catch (error) {
            console.error(`[CategoryController] Error deleting category by id: ${error.message}`);
            next(error);  // Ensure error is passed to the next middleware (error handler)
        }
    }


}

const categoryController = new CategoryController();
export default categoryController;
