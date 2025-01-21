import db from '../db/db.js'

export const createContactModel = async (firstName, lastName, email, phone, message) => {
    try {
        const query = 'INSERT INTO contact_us (first_name, last_name, phone, email, message) VALUES (?,?,?,?,?) RETURNING *';
        const [result] = await db.query(query, [firstName, lastName, email, phone, message]);
        return result.length === 0 ? null : result;
    } catch (error) {
        console.log('Contact Model', error);
        throw new Error(error);
    }
}

export const getAllContactModel = async () => {
    try {
        const query = 'SELECT * FROM contact_us';
        const [result] = await db.query(query);
        return result.length === 0 ? null : result;
    } catch (error) {
        console.log('Contact Model', error);
        throw new Error(error);
    }
}

export const getContactByIdModel = async (contactId) => {
    try {
        const query = 'SELECT * FROM contact_us WHERE contact_id = ?';
        const [result] = await db.query(query, [contactId]);
        return result.length === 0 ? null : result;
    } catch (error) {
        console.log('Contact Model', error);
        throw new Error(error);
    }
}

export const editContactByIdModel = async (contactId) => {
    try {
        const query = 'SELECT * FROM contact_us WHERE contact_id = ?';
        const [result] = await db.query(query, [contactId]);
        return result.length === 0 ? null : result;
    } catch (error) {
        console.log('Contact Model', error);
        throw new Error(error);
    }
}

export const deleteContactByIdModel = async (contactId) => {
    try {
        const query = 'DELETE FROM contact_us WHERE contact_id = ?';
        const [result] = await db.query(query, [contactId]);
        return result.length === 0 ? null : result;
    } catch (error) {
        console.log('Contact Model', error);
        throw new Error(error);
    }
}



