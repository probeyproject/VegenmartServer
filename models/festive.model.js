import db from '../db/db.js';

export const getAllUsers = async () => {
    try {
        const [rows] = await db.query('SELECT * FROM users');
        return rows;
    } catch (error) {
        throw new Error('Error fetching users from the database: ' + error.message);
    }
};

export const getFestiveDatesForToday = async (today) => {
    try {
        const [rows] = await db.query('SELECT * FROM festive_dates WHERE event_date = ?', [today]);
        return rows;
    } catch (error) {
        throw new Error('Error fetching festive dates: ' + error.message);
    }
};


export const createFestiveDatemodel = async (eventName, eventDate) => {
    try {
        const query = 'INSERT INTO festive_dates (event_name, event_date) VALUES (?,?)';
        const [result] = await db.query(query, [eventName, eventDate]);
        return result.length === 0 ? null : result;
    } catch (error) {
        console.log(error);
        throw new Error("DB Error : ", error);
    }
}

export const getAllFestiveDatemodel = async () => {
    try {
        const query = 'SELECT * FROM  festive_dates';
        const [result] = await db.query(query);
        return result.length === 0 ? null : result;
    } catch (error) {
        console.log(error);
        throw new Error("DB Error : ", error);
    }
}

export const editFestiveDateByIdmodel = async (eventName, eventDate, festiveId) => {
    try {
        const query = 'UPDATE festive_dates SET event_name = ?, event_date = ? WHERE id = ?';
        const [result] = await db.query(query, [eventName, eventDate, festiveId]);
        return result.length === 0 ? null : result;
    } catch (error) {
        console.log(error);
        throw new Error("DB Error : ", error);
    }
}

export const deleteByIdFestiveDatemodel = async (festiveId) => {
    try {
        const query = 'DELETE  FROM  festive_dates WHERE id = ?';
        const [result] = await db.query(query, [festiveId]);
        return result.length === 0 ? null : result;
    } catch (error) {
        console.log(error);
        throw new Error("DB Error : ", error);
    }
}