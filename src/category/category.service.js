import autoBind from "auto-bind";
import CategoryModel from "./category.model.js";
import fs from "fs";
import path from "path";

class CategoryService {
    #categoryModel;

    constructor() {
        autoBind(this);
        this.#categoryModel = CategoryModel;
    }

    // create category
    async createCategory({title, icon = null, description, seoWords}) {
        try {
            // Check if the category already exists
            const existingCategory = await this.#categoryModel.findOne({title}).lean();
            if (existingCategory) {
                throw new Error(`Category with title '${title}' already exists.`);
            }

            const newCategory = new this.#categoryModel({
                title,
                icon: icon || null,
                slug: title.trim().replace(/\s+/g, '-').toLowerCase(),
                description,
                seoWords,
                isActive: true,
            });

            await newCategory.save();
            return newCategory;
        } catch (error) {
            console.error(`[CategoryService] Error creating category: ${error.message}`);
            throw new Error("Failed to create category. Please try again later.");
        }
    }

    /**
     * Retrieves all categories.
     * @returns {Promise<Array>} List of categories.
     * @throws Will throw an error if the operation fails.
     */
    async getCategories() {
        try {
            const categories = await this.#categoryModel.find({});
            return categories;
        } catch (error) {
            console.error(`[CategoryService] Error retrieving categories: ${error.message}`);
            throw new Error("Failed to retrieve categories. Please try again later.");
        }
    }

    async getCategoryById(catId) {
        try {
            const category = await this.#categoryModel.findById(catId);
            if (!category) throw new Error("Category not found");
            return category;
        } catch (error) {
            console.error(`[CategoryService] Error retrieving category: ${error.message}`);
            throw new Error("Failed to retrieve categories. Please try again later.");
        }
    }

    // filter category due to the query of the title
    async filterCategory(title) {
        try {
            const category = await this.#categoryModel.findOne({title: title});
            if (!category) throw new Error("Category not found");
            return category;
        } catch (error) {
            console.error(`[CategoryService] Error retrieving category: ${error.message}`);
            throw new Error("Failed to retrieve categories. Please try again later.");
        }
    }

    async updateCategoryById({catId, title, description, icon, seoWords, isActive}) {
        try {


            const existCategory = await this.#categoryModel.findById(catId).lean();
            if (!existCategory) throw new Error("Category not found");

            // Delete existing icon file if it's being replaced
            if (icon && existCategory.icon) this.deleteFile(path.basename(existCategory.icon));

            // Update the category
            const updatedCategory = await this.#categoryModel.findByIdAndUpdate(
                catId,
                {
                    title,
                    description,
                    icon,
                    seoWords,
                    slug: title?.trim().replace(/\s+/g, '-').toLowerCase(),
                    isActive
                },
                {new: true}
            );

            return updatedCategory;
        } catch (error) {
            console.error(`[CategoryService] Error updating category: ${error.message}`);
            throw new Error("Failed to update category by id. Please try again later.");
        }
    }


    async deleteCategoryById(catId) {
        try {
            const cat = await this.#categoryModel.findById(catId);
            if (!cat) throw new Error("Category not found");

            // delete icon
            if (cat.icon) this.deleteFile(path.basename(cat.icon));

            const deleteCat = await this.#categoryModel.findByIdAndDelete(catId);

            return deleteCat;
        } catch (error) {
            console.error(`[CategoryService] Error deleting category: ${error.message}`);
            throw new Error("Failed to delete category");
        }
    }


    // delete old icons and add new icons

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

const categoryService = new CategoryService();
export default categoryService;
