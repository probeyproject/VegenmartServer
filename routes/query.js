import express from 'express';
import { handleQuery, userQueryMobile } from '../controllers/queryModule/query.controller.js';
const router = express.Router();

router.post('/handle-query', handleQuery);
router.post('/enter-mobile', userQueryMobile);

export default router;
