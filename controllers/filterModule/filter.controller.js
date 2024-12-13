import { getAllProductByFilterModel, searchProductsModel } from "../../models/filter.model.js";
import db from "../../db/db.js";

export const getAllProductByFilter = async (req, res) => {
    try {
        let filter = {
            productName: req.query.productName || undefined,
            tags: req.query.tags || undefined,
            categoryName: req.query.categoryName || undefined,
            minPrice: req.query.minPrice || undefined,
            maxPrice: req.query.maxPrice || undefined,
            foodPreference: req.query.foodPreference || undefined, // New food preference filter
            page: parseInt(req.query.page) || 1, // Default to page 1
            limit: parseInt(req.query.limit) || 8, // Default to 8 products per page
        };

        let filteredResults = await getAllProductByFilterModel(filter);

        // Calculate total count of products for pagination (without limit)
        let countQuery = `
            SELECT COUNT(*) as totalCount
            FROM product
            JOIN categories ON product.category_id = categories.category_id
            WHERE 1=1
        `;
        
        let countQueryParams = [];
        
        // Apply filters to the count query as well
        if (filter.productName) {
            countQueryParams.push(`%${filter.productName}%`);
            countQuery += ` AND product.product_name LIKE ?`;
        }

        if (filter.tags) {
            countQueryParams.push(`%${filter.tags}%`);
            countQuery += ` AND product.tags LIKE ?`;
        }

        if (filter.categoryName) {
            countQueryParams.push(`%${filter.categoryName}%`);
            countQuery += ` AND categories.category_name LIKE ?`;
        }

        if (filter.minPrice) {
            countQueryParams.push(filter.minPrice);
            countQuery += ` AND product.product_price >= ?`;
        }

        if (filter.maxPrice) {
            countQueryParams.push(filter.maxPrice);
            countQuery += ` AND product.product_price <= ?`;
        }

        if (filter.foodPreference) {
            countQueryParams.push(filter.foodPreference);
            countQuery += ` AND product.food_preference = ?`;
        }

        let [countResult] = await db.query(countQuery, countQueryParams);
        let totalCount = countResult[0].totalCount;
        let totalPages = Math.ceil(totalCount / filter.limit);

        return res.status(200).json({
            products: filteredResults,
            totalCount,
            totalPages,
            currentPage: filter.page,
        });
    } catch (error) {
        console.log("getAllProductByFilter Error:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};











// Search for products based on search term
export const searchProducts = async (req, res) => {
    try {
        const searchTerm = req.query.q;  // Get search term from query parameters

        if (!searchTerm) {
            return res.status(400).json({ error: "Search term is required" });
        }

        // Await the result from the model
        const products = await searchProductsModel(searchTerm);

        // If no products are found, return a 404 response
        if (products.length === 0) {
            return res.status(404).json({ message: "No products found" });
        }

        // Return the fetched products
        return res.status(200).json({ products });
    } catch (error) {
        console.log("Search Error:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};




