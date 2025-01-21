import db from '../db/db.js';

export const createCouponModel = async (coupon_code, discount_type, discount_value, start_date, end_date, product_id) => {
    try {
        const query = `
            INSERT INTO coupons (coupon_code, discount_type, discount_value, start_date, end_date, product_id)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        const [result] = await db.query(query, [coupon_code, discount_type, discount_value, start_date, end_date, product_id]);
        return result.length === 0 ? null : result;
    } catch (error) {
        throw new Error(`Database Error: ${error.message}`);
    }
}

export const getAllCouponModel = async () => {
    try {
        const query = `SELECT * FROM coupons`;
        const [result] =  await db.query(query);
        return result.length === 0 ? null : result;
    } catch (error) {
        throw new Error(`Database Error: ${error.message}`);
    }
}

// Get a coupon by ID and check if it's expired
export const getCouponByIdModel = async (couponId) => {
    try {
        const query = `
    SELECT *, 
        CASE 
            WHEN CURDATE() BETWEEN start_date AND end_date THEN 'valid' 
            ELSE 'invalid' 
        END AS coupon_status 
    FROM coupons 
    WHERE coupon_id = ?
`;

        return await db.query(query, [couponId]);
    } catch (error) {
        throw new Error(`Database Error: ${error.message}`);
    }
}

export const editCouponByIdModel = async (coupon_code, discount_type, discount_value, start_date, end_date, product_id, couponId) => {
    try {
        const query = `
            UPDATE coupons SET coupon_code = ?, discount_type = ?, discount_value = ?, start_date = ?, end_date = ?, product_id = ?
            WHERE coupon_id = ?
        `;
        const [result] = await db.query(query, [coupon_code, discount_type, discount_value, start_date, end_date, product_id, couponId]);

        return result.length === 0 ? null : result;
    } catch (error) {
        throw new Error(`Database Error: ${error.message}`);
    }
}

export const deleteCouponByIdModel = async (couponId) => {
    try {
        const query = `DELETE FROM coupons WHERE coupon_id = ?`;
        const [result] =  await db.query(query, [couponId]);
        return result.length === 0 ? null : result;
    } catch (error) {
        throw new Error(`Database Error: ${error.message}`);
    }
}

// Validate coupon by code and check expiration for a specific product
export const validateCouponModel = async (coupon_code, product_id) => {
    try {
        const query = `
            SELECT *, 
                CASE 
                    WHEN CURDATE() < start_date THEN 'not yet valid' 
                    WHEN CURDATE() > end_date THEN 'expired' 
                    ELSE 'valid' 
                END AS coupon_status 
            FROM coupons 
            WHERE coupon_code = ? AND (product_id IS NULL OR product_id = ?)
        `;
        const [results] = await db.query(query, [coupon_code, product_id]);

        if (!results.length) throw new Error('Coupon not found or not applicable for this product');
        return results[0];
    } catch (error) {
        throw new Error(`Database Error: ${error.message}`);
    }
};
