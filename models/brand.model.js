import db from "../db/db.js";

export const createBrandModel = async (brandName, status) => {
    try {
        const query = 'INSERT INTO brands (brand_name, status) VALUES (?,?)';
        const [result] = await db.query(query, [brandName,status]);
        return result.length === 0 ? null : result;
    } catch (error) {
        console.log(error);
        throw new Error(`brands DB error ${error.message}`)
    }
}

export const getAllBrandModel = async () => {
    try {
        const query = 'SELECT * FROM brands';
        const [result] = await db.query(query);
        return result.length === 0 ? null : result;
    } catch (error) {
        console.log(error);
        throw new Error(`brands DB error ${error.message}`)
    }
}

export const getBrandByIdModel = async (brandId) => {
    try {
        const query = 'SELECT * FROM brands WHERE brand_id = ?';
        const [result] = await db.query(query, [brandId]);
        return result.length === 0 ? null : result;
    } catch (error) {
        console.log(error);
        throw new Error(`brands DB error ${error.message}`)
    }
}

export const ediBrandByIdModel = async (brandId,brandName,status) => {
    try {
        const query = 'UPDATE brands SET brand_name = ?, status = ? WHERE brand_id  = ?';
        const [result] = await db.query(query, [brandId, brandName, status]);
        return result.length === 0 ? null : result;
    } catch (error) {
        console.log(error);
        throw new Error(`brands DB error ${error.message}`)
    }
}

export const deleteBrandByIdModel = async (brandId) => {
    try {
        const query = 'DELETE FROM brands WHERE brand_id = ?';
        const [result] = await db.query(query, [brandId]);
        return result.length === 0 ? null : result;
    } catch (error) {
        console.log(error);
        throw new Error(`brands DB error ${error.message}`)
    }
}