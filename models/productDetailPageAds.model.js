import db from '../db/db.js';

export const createProductDetailPageAdsModel = async (adsLogoImg,companyName,rating,companyDetails,address,contact,status) => {
    try {
        const query = 'INSERT INTO detailpageads (logo_url, company_name, rating, company_details, address, contact, status) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const [result] = await db.query(query, [adsLogoImg,companyName,rating,companyDetails,address,contact,status]);
        return result.length === 0 ? null : result;
    } catch (error) {
        console.error('ProductDetail Model Error:', error);
        throw new Error(`ProductDetail Model DB error ${error.message}`);
    }
}

export const getAllProductDetailPageAdsModel = async () => {
    try {
        const query = 'SELECT * FROM detailpageads';
        const [result] = await db.query(query);
        return result.length === 0 ? null : result;
    } catch (error) {
        console.error('ProductDetail Model Error:', error);
        throw new Error(`ProductDetail Model DB error ${error.message}`);
    }
}

export const getProductDetailPageAdsByIdModel = async (adsId) => {
    try {
        const query = 'SELECT * FROM detailpageads WHERE ads_id = ?';
        const [result] = await db.query(query, [adsId]);
        return result.length === 0 ? null : result;
    } catch (error) {
        console.error('ProductDetail Model Error:', error);
        throw new Error(`ProductDetail Model DB error ${error.message}`);
    }
}



// For Edit => Function to fetch the existing ad details by adsId
export const getEditForDetailPageAdsByIdModel = async (adsId) => {
    try {
        const query = 'SELECT * FROM detailpageads WHERE ads_id = ?';
        const [result] = await db.query(query, [adsId]);
        return result.length === 0 ? null : result[0];
    } catch (error) {
        console.error('ProductDetail Model Error:', error);
        throw new Error(`ProductDetail Model DB error ${error.message}`);
    }
};
export const editProductDetailPageAdsByIdModel = async (adsLogoImg,companyName,rating,companyDetails,address,contact,status,adsId) => {
    try {
        const query = 'UPDATE detailpageads SET logo_url = ?, company_name = ?, rating = ?, company_details = ?, address = ?, contact = ?, status = ? WHERE ads_id = ?';
        const [result] = await db.query(query, [adsLogoImg,companyName,rating,companyDetails,address,contact,status,adsId]);
        return result.length === 0 ? null : result;
    } catch (error) {
        console.error('ProductDetail Model Error:', error);
        throw new Error(`ProductDetail Model DB error ${error.message}`);
    }
}

export const deleteProductDetailPageAdsByIdModel = async (adsId) => {
    try {
        const query = 'DELETE FROM detailpageads WHERE ads_id = ?';
        const [result] = await db.query(query, [adsId]);
        return result.length === 0 ? null : result;
    } catch (error) {
        console.error('ProductDetail Model Error:', error);
        throw new Error(`ProductDetail Model DB error ${error.message}`);
    }
}