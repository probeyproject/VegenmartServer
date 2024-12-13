import db from '../db/db.js';
import { promisify } from 'util';

export const getAllProductByFilterModel = async (filter) => {
    try {
        const {
            productName,
            tags,
            categoryName,
            minPrice,
            maxPrice,
            foodPreference,
            page = 1,
            limit = 10,
        } = filter;

        let query = `
            SELECT product.*, categories.category_name
            FROM product
            JOIN categories ON product.category_id = categories.category_id
            WHERE 1=1
        `;
           
        let queryParams = [];

        // Apply filters
        if (productName) {
            queryParams.push(`%${productName}%`);
            query += ` AND product.product_name LIKE ?`;
        }

        if (tags) {
            queryParams.push(`%${tags}%`);
            query += ` AND product.tags LIKE ?`;
        }

        if (categoryName) {
            queryParams.push(`%${categoryName}%`);
            query += ` AND categories.category_name LIKE ?`;
        }

        if (minPrice) {
            queryParams.push(minPrice);
            query += ` AND product.product_price >= ?`;
        }

        if (maxPrice) {
            queryParams.push(maxPrice);
            query += ` AND product.product_price <= ?`;
        }

        if (foodPreference) {
            queryParams.push(foodPreference);
            query += ` AND product.food_preference = ?`;
        }

        // Apply pagination: limit the number of results and calculate offset
        const offset = (page - 1) * limit;
        query += ` LIMIT ? OFFSET ?`;
        queryParams.push(limit, offset);

        // Execute the query
        const [results] = await db.query(query, queryParams);

        return results;
    } catch (error) {
        console.log("Database Query Error:", error);
        throw new Error(`Filter Model DB error: ${error.message}`);
    }
};


export const searchProductsModel = async (searchTerm) => {
    try {
      const queryText = `
        SELECT 
          p.product_id,
          p.product_name,
          p.product_price,
          p.weight,
          p.product_image,
          p.status,
          p.discount_price,
          p.weight_type,
          p.stock,
          AVG(r.rating) AS average_rating,
          pr.price_id,
          pr.min_weight,
          pr.max_weight,
          pr.discount_price AS offer_discount_price
        FROM 
          product p
        LEFT JOIN 
          reviews r ON p.product_id = r.product_id
        LEFT JOIN 
          price pr ON p.product_id = pr.product_id
        WHERE 
          p.product_name LIKE ? 
          OR p.product_description LIKE ?
        GROUP BY 
          p.product_id, pr.price_id
      `;
  
      const likeSearchTerm = `%${searchTerm}%`;  // Wildcard for LIKE query
  
      // Execute the query with the search term
      const [results] = await db.query(queryText, [likeSearchTerm, likeSearchTerm]);
  
      // Process the result to group products and add offers
      const products = {};
  
      results.forEach((row) => {
        // If the product is not already in the products object, add it
        if (!products[row.product_id]) {
          products[row.product_id] = {
            product_id: row.product_id,
            product_name: row.product_name,
            product_price: row.product_price,
            weight: row.weight,
            product_image: row.product_image ? row.product_image : [],
            status: row.status,
            discount_price: row.discount_price,
            weight_type: row.weight_type,
            stock: row.stock,
            average_rating: row.average_rating,
            offers: [] 
          };
        }
  
        // Add the offer to the product's offers array
        products[row.product_id].offers.push({
          min_weight: row.min_weight,
          max_weight: row.max_weight,
          discount_price: row.offer_discount_price
        });
      });
  
      // Convert the products object to an array and return
      return Object.values(products);
      
    } catch (error) {
      console.log("Database Query Error:", error);
      throw new Error(`Filter Model DB error: ${error.message}`);
    }
  };
  


