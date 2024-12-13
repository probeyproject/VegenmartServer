import db from '../db/db.js';

export const createBusinessModel = async (firstName, lastName, email, phone, address, message) => {
    try {
        const query = 'INSERT INTO businesses (first_name,last_name,email,phone_number,address,message) VALUES (?,?,?,?,?,?)';
        const [result] = await db.query(query, [firstName, lastName, email, phone, address, message]);
        result.length === 0 ? null : result;
    } catch (error) {
        console.log('business model', error);
        throw new Error("DB Model Error");
    }
}

export const getAllBusinessModel = async () => {
    try {
        const query =  'SELECT * FROM businesses';
        const [result] = await db.query(query);
        return result.length === 0 ? null : result;
    } catch (error) {
        console.log('business model', error);
        throw new Error("DB Model Error");
    }
}

export const getBusinessByIdModel = async (businesId) => {
    try {
        const query =  'SELECT * FROM businesses WHERE business_id = ?';
        const [result] = await db.query(query, [businesId]);
        return result.length === 0 ? null : result;
    } catch (error) {
        console.log('business model', error);
        throw new Error("DB Model Error");
    }
}

export const deleteBusinessByIdModel = async (businesId) => {
    try {
        const query =  'DELETE FROM businesses WHERE business_id = ?';
        const [result] = await db.query(query, [businesId]);
        return result.length === 0 ? null : result;
    } catch (error) {
        console.log('business model', error);
        throw new Error("DB Model Error");
    }
}