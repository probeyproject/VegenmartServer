import db from '../db/db.js';

export const createCareInstructionModel = async (categoryId,careInstruction) => {
    try {
        const query = 'INSERT INTO careinstruction (category_id, care_instruction) VALUES (?, ?)';
        const [result] = await db.query(query, [categoryId, careInstruction]);
        return result.length === 0 ? null : result;
    } catch (error) {
        console.log('createcareInstructionModel DB error', error);
        throw new Error(`createcareInstructionModel DB error ${error.message}`)
    }
}

export const getAllCareInstructionModel = async () => {
    try {
       const query = 'SELECT * FROM careinstruction';
       const [result] = await db.query(query);
       return result.length === 0 ? null : result;
    } catch (error) {
        console.log('DB error', error);
        throw new Error(`createcareInstructionModel DB error ${error.message}`) 
    }
}

export const getByCareInstructionIdModel = async (categoryId) => {
    try {
    const query = 'SELECT * FROM careinstruction WHERE category_id = ?';
    const [result] = await db.query(query, [categoryId]);
    return result.length === 0 ? null : result;
    } catch (error) {
        console.log('DB error', error); 
        throw new Error(`createcareInstructionModel DB error ${error.message}`)
    }
}

export const editCareInstructionByIdModel = async (careInstruction,careId) => {
    
    try {
        const query = 'UPDATE careinstruction SET care_instruction = ? WHERE care_id = ?';
        const [result] = await db.query(query, [careInstruction,careId]);
        return result;
    } catch (error) {
        console.log('DB error', error);
        throw new Error(`createcareInstructionModel DB error ${error.message}`) 
    }
}

export const deleteCareInstructionByIdModel = async (careId) => {
    try {
        const query = 'DELETE FROM careinstruction WHERE care_id = ?';
        const [result] = await db.query(query, [careId]);
        return result.length === 0 ? null : result;
        
    } catch (error) {
        console.log('DB error', error);
        throw new Error(`createcareInstructionModel DB error ${error.message}`) 
    }
}