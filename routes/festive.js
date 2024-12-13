import express from 'express';
import { createFestiveDate, deleteFestiveDateById, editFestiveDateById, getAllFestiveDate, sendFestiveMessages } from '../controllers/festiveModule/festive.controller.js';

const router = express.Router();

router.post('/createFestiveDate', createFestiveDate);
router.get('/getAllFestiveDate', getAllFestiveDate);
router.put('/editFestiveDateById/:festiveId', editFestiveDateById);
router.delete('/deleteFestiveDateById/:festiveId', deleteFestiveDateById);

// Endpoint to manually trigger sending festive messages (optional)
router.post('/send-festive-messages', async (req, res) => {
    try {
        await sendFestiveMessages();
        return res.status(200).send('Festive messages sent successfully');
    } catch (error) {
        return res.status(500).send('Error sending festive messages');
    }
});

export default router;
