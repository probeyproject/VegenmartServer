import db from '../db/db.js'

export const getBannerOfferModel = async (offerType) => {
    try {
        const query = 'SELECT * FROM product WHERE discount_price = ?';
        const [result] = await db.query(query, [offerType]);
        return result.length === 0 ? null : result;
    } catch (error) {
        console.log('Banner Offer Model', error);
        throw new Error(`Banner Model DB error ${error.message}`);
    }
}

export const getFreshProductModel = async () => {
    try {
        const query = `
      SELECT * FROM product
      WHERE created_at >= NOW() - INTERVAL 24 HOUR
      ORDER BY created_at DESC`;
        const [result] = await db.query(query);
        return result.length === 0 ? null : result;
    } catch (error) {
        console.log('Banner Offer Model', error);
        throw new Error(`Banner Model DB error ${error.message}`);
    }
}