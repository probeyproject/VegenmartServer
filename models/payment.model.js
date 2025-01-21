import db from '../db/db.js';

export const createOrderPaymentModel = async (amount, currency, receipt) => {
    return new Promise((resolve, reject) => {
        const options = {
            amount: amount * 100,
            currency: currency,
            receipt: receipt,
        };
        
        db.query('INSERT INTO payments SET ?', options, (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results.insertId);
        });
    });
};


// Function to save payment details
export const savePaymentDetailsModel = async (paymentData) => {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO payments SET ?', paymentData, (error, result) => {
            if (error) {
                return reject(error);
            }
            resolve(result.insertId); // Return the payment ID
        });
    });
};