import db from '../db/db.js';

export const createAdditionInfoModel = async (specialty, IngredientType, brand, form, packageInformation, manufacture, categoryId) => {
    try {
        const query = 'INSERT INTO additioninfo (specialty, ingredient_type, brand, form, package_information, manufacture, category_id) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const [result] = await db.query(query, [specialty, IngredientType, brand, form, packageInformation, manufacture, categoryId]);
        return result.length === 0 ? null : result;
    } catch (error) {
        console.log('createcareInstructionModel DB error', error);
        throw new Error(`createcareInstructionModel DB error ${error.message}`)
    }
}

export const getAllAdditionInfoModel = async () => {
    try {
       const query = 'SELECT * FROM additioninfo';
       const [result] = await db.query(query);
       return result.length === 0 ? null : result;
    } catch (error) {
        console.log('DB error', error);
        throw new Error(`createcareInstructionModel DB error ${error.message}`)
    }
}

export const getByAdditionInfoIdModel = async (categoryId) => {
    try {
    const query = 'SELECT * FROM additioninfo WHERE category_id = ?';
    const [result] = await db.query(query, [categoryId]);
    return result.length === 0 ? null : result;
    } catch (error) {
        console.log('DB error', error);
        throw new Error(`createcareInstructionModel DB error ${error.message}`)
    }
}

export const getAdditionInfoByIdForEditModel = async (additionalId) => {
    try {
        const query = 'SELECT * FROM additioninfo WHERE addition_id = ?';
        const [row] = await db.query(query, [additionalId]);
        return row[0];
    } catch (error) {
        console.log('DB error', error);
        throw new Error(`createcareInstructionModel DB error ${error.message}`)
    }
}

export const getAdditionInfoForEditByIdModel = async (additionalId) => {
    try {
        const query = 'SELECT * FROM additioninfo WHERE addition_id = ?';
        const [result] = await db.query(query, [additionalId]);
        return result.length === 0 ? null : result;
    } catch (error) {
        console.log('DB error', error);
        throw new Error(`createcareInstructionModel DB error ${error.message}`) 
    }
}

export const editAdditionInfoByIdModel = async (specialty, IngredientType, brand, form, packageInformation, manufacture, additionalId) => {
    
    try {
        const query = 'UPDATE additioninfo SET specialty = ?, ingredient_type = ?, brand = ?, 	form = ?, package_information = ?, 	manufacture = ? WHERE addition_id = ?';
        const [result] = await db.query(query, [specialty, IngredientType, brand, form, packageInformation, manufacture,additionalId]);
        return result;
    } catch (error) {
        console.log('DB error', error);
        throw new Error(`createcareInstructionModel DB error ${error.message}`)
    }
}

export const deleteAdditionInfoByIdModel = async (additionalId) => {
    try {
        const query = 'DELETE FROM additioninfo WHERE addition_id = ?';
        const [result] = await db.query(query, [additionalId]);
        return result.length === 0 ? null : result;
        
    } catch (error) {
        console.log('DB error', error);
        throw new Error(`createcareInstructionModel DB error ${error.message}`)
    }
}