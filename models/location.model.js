import db from '../db/db.js';

export const createLocationModel = async (location) => {
    try {
        const query = `INSERT INTO locations (location) VALUES (?)`;
        const [result] = await db.query(query, [location]);
        return result.length === 0 ? null : result
    } catch (error) {
        console.log('Model Error', error);
        throw new Error("Server Model Error", error);
    }
};

export const getAllLocationModel = async () => {
    try {
        const query = `SELECT * FROM Sociaty`;
        const [result] = await db.query(query);
        return result.length === 0 ? null : result
    } catch (error) {
        console.log('Model Error', error);
        throw new Error("Server Model Error", error);
    }
};

export const getLocationByIdModel = async (locationId) => {
    try {
        const query = `SELECT * FROM locations WHERE id = ?`;
        const [result] = await db.query(query,[locationId]);
        return result.length === 0 ? null : result
    } catch (error) {
        console.log('Model Error', error);
        throw new Error("Server Model Error", error);
    }
};

export const edittLocationByIdModel = async (location,locationId) => {
    try {
        const query = `UPDATE locations SET location = ? WHERE id = ?`;
        const [result] = await db.query(query,[location,locationId]);
        return result.length === 0 ? null : result
    } catch (error) {
        console.log('Model Error', error);
        throw new Error("Server Model Error", error);
    }
};

export const deleteLocationByIdModel = async (locationId) => {
    try {
        const query = `DELETE FROM locations WHERE id = ?`;
        const [result] = await db.query(query,[locationId]);
        return result.length === 0 ? null : result
    } catch (error) {
        console.log('Model Error', error);
        throw new Error("Server Model Error", error);
    }
};






export const saveLocation = async (userId, latitude, longitude, address) => {
    try {
        const query = `INSERT INTO locations (user_id, latitude, longitude, address) VALUES (?, ?, ?, ?)`;
        const [result] = await db.query(query, [userId, latitude, longitude, address]);
        return result.length === 0 ? null : result
    } catch (error) {
        console.log('err', error);
        throw new Error("Server Error", error);
    }
};
