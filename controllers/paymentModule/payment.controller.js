import { savePaymentDetailsModel } from '../../models/payment.model.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Controller to create a Razorpay order
export const createOrderPayment = async (req, res) => {
    const { amount, currency, order_id } = req.body;
    
    const options = {
        amount: amount * 100,
        currency: currency,
        receipt: `receipt_order_${order_id}`,
    };

    try {
        const response = await razorpay.orders.create(options);
        return res.json({
            id: response.id,
            currency: response.currency,
            amount: response.amount,
        });
    } catch (error) {
       return res.status(500).send('Error in creating Razorpay order');
    }
};


// Controller to verify payment
export const verifyPayment = async (req, res) => {
    const {
        order_id,
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
        amount_paid,
    } = req.body;

    // Verify the Razorpay signature
    const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = shasum.digest('hex');

    if (generatedSignature === razorpay_signature) {
        // Prepare payment data
        const paymentData = {
            order_id,
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
            payment_status: 'success',
            payment_method: 'razorpay',
            amount_paid
        };

        try {
            const paymentId = await savePaymentDetailsModel(paymentData);
            return res.json({ message: 'Payment verified and saved', payment_id: paymentId });
        } catch (error) {
           return res.status(500).json({ message: 'Database Error: Unable to save payment' });
        }
    } else {
       return res.status(400).json({ message: 'Invalid signature, payment failed' });
    }
};
