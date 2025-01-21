import db from "../db/db.js";

export const createHeaderAdsModel = async (adName,adDescription,adLink,status) => {
    try {
        const query = 'INSERT INTO headerads (ad_name,ad_description,ad_link,status) VALUES (?,?,?,?)';
        const [result] = await db.query(query, [adName,adDescription,adLink,status]);
        return result.length === 0 ? null : result;
    } catch (error) {
        console.log('Header Ads DB Error', error);
        throw new Error(`Header Model DB error ${error.message}`);
    }
}

export const getAllHeaderAdsModel = async () => {
    try {
        const query = 'SELECT headerads.ad_description FROM headerads';
        const [result] = await db.query(query);
        return result.length === 0 ? null : result;
    } catch (error) {
        console.log('Header Ads DB Error', error);
        throw new Error(`Header Model DB error ${error.message}`);
    }
}

export const getHeaderAdsByIdModel = async (headerAdsId) => {
    try {
        const checkHeaderAdsIdIsValidQuery = 'SELECT * FROM headerads WHERE ad_id = ?';
        const [checkHeaderAdsIdIsValid] = await db.query(checkHeaderAdsIdIsValidQuery, [headerAdsId]);
        if(checkHeaderAdsIdIsValid.length === 0) {
            return {error : "Invalid Id"};
        }

        const query = 'SELECT * FROM headerads WHERE ad_id = ?';
        const [result] = await db.query(query, [headerAdsId]);
        return result.length === 0 ? null : result;
    } catch (error) {
        console.log('Header Ads DB Error', error);
        throw new Error(`Header Model DB error ${error.message}`);
    }
}

// For Edit API
export const getEditForHeaderAdsModel = async (headerAdsId) => {
    try {
        const query = 'SELECT * FROM headerads WHERE ad_id = ?';
        const [rows] = await db.query(query, [headerAdsId]);
        return rows[0];
    } catch (error) {
        console.log('Header Ads Controller Error', error);
        throw new Error(`Header Model DB error ${error.message}`);
    }
}

export const editHeaderAdsByIdModel = async (adName,adDescription,adLink,status,headerAdsId) => {
    try {
        const query = 'UPDATE headerads SET ad_name = ?, ad_description = ?, ad_link = ?, status = ? WHERE ad_id = ?';
        const [result] = await db.query(query, [adName,adDescription,adLink,status,headerAdsId]);
        return result.length === 0 ? null : result;
    } catch (error) {
        console.log('Header Ads DB Error', error);
        throw new Error(`Header Model DB error ${error.message}`);
        
    }
}

export const deleteHeaderAdsByIdModel = async (headerAdsId) => {
    try {

        const checkHeaderAdsIdIsValidQuery = 'SELECT * FROM headerads WHERE ad_id = ?';
        const [checkHeaderAdsIdIsValid] = await db.query(checkHeaderAdsIdIsValidQuery, [headerAdsId]);
        if(checkHeaderAdsIdIsValid.length === 0) {
            return {error : "Invalid Id"};
        }

        const query = 'DELETE FROM headerads WHERE ad_id = ?';
        const [result] = await db.query(query, [headerAdsId]);
        return result.length === 0 ? null : result;
    } catch (error) {
        console.log('Header Ads DB Error', error);
        throw new Error(`Header Model DB error ${error.message}`);
    }
}