import db from '../db/db.js';

export const createOfferModel = async (offerName,offerDescription,discountType,discountValue,startDate,endDate,productId) => {
    try {
        const checkProductQuery = 'SELECT * FROM product WHERE  product_id = ?';
        const [existProduct] = await db.query(checkProductQuery, [productId]);
        if(existProduct.length === 0) {
            return { error : "Invalid Product Id"}
        }

        const query = 'INSERT INTO offers (offer_name,offer_description,discount_type,discount_value,start_date,end_date,product_id) VALUES (?,?,?,?,?,?,?)';
        const [result] = await db.query(query, [offerName, offerDescription,discountType,discountValue,startDate,endDate,productId]);
        return result.length === 0 ? null : result
    } catch (error) {
        console.error('offers Model Error:', error);
        throw new Error(`Offers Model DB error ${error.message}`);
    }
}

export const getAllOfferModel = async () => {
    try {
       const query = 'SELECT * FROM offers';
       const [result] = await db.query(query);
       return result.length === 0 ? null : result;
    } catch (error) {
        console.error('offers Model Error:', error);
        throw new Error(`Offers Model DB error ${error.message}`);
    }
}

export const getOfferByIdModel = async (offerId) => {
    try {
    const query = 'SELECT * FROM offers WHERE offer_id = ?';
    const [result] = await db.query(query, [offerId]);
    return result.length === 0 ? null : result;
    } catch (error) {
        console.error('offers Model Error:', error);
        throw new Error(`Offers Model DB error ${error.message}`);
    }
}

export const getOfferForEditByIdModel = async (offerId) => {
    try {
        const query = 'SELECT * FROM offers WHERE offer_id = ?';
        const [rows] = await db.query(query, [offerId]);
        return rows[0];
    } catch (error) {
        console.error('offers Model Error:', error);
        throw new Error(`Offers Model DB error ${error.message}`);
    }
}

export const editOfferByIdModel = async (offerId,offerName,offerDescription,discountType,discountValue,startDate,endDate) => {
    
    try {
        const query = 'UPDATE offers SET offer_name = ?, offer_description = ?, discount_type = ?, discount_value = ?, start_date = ?, end_date = ? WHERE offer_id = ?';
        const [result] = await db.query(query, [offerName,offerDescription,discountType,discountValue,startDate,endDate,offerId]);
        return result;
    } catch (error) {
        console.error('offers Model Error:', error);
        throw new Error(`Offers Model DB error ${error.message}`);
    }
}

export const deleteOfferByIdModel = async (offerId) => {
    try {
        const query = 'DELETE FROM offers WHERE offer_id = ?';
        const [result] = await db.query(query, [offerId]);
        return result.length === 0 ? null : result;
        
    } catch (error) {
        console.error('offers Model Error:', error);
        throw new Error(`Offers Model DB error ${error.message}`);
    }
}

export const getOfferByProductIdModel = async (productId) => {
    try {
        const query = 'SELECT * FROM offers WHERE product_id = ?';
    const [result] = await db.query(query, [productId]);
    return result.length === 0 ? null : result;
    } catch (error) {
        console.error('offers Model Error:', error);
        throw new Error(`Offers Model DB error ${error.message}`);
    }
}