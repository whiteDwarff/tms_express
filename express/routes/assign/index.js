import express from 'express';

import examineeRouter from './examinee.js';
import locationRouter from './location.js';
import serveyRouter from './servey.js';

const router = express.Router();

router.use(examineeRouter);
router.use(locationRouter);
router.use(serveyRouter);

export default router;
