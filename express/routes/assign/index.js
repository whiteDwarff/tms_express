import express from 'express';

import examineeRouter from './examinee.js';
import locationRouter from './location.js';
import serveyRouter from './servey.js';
import categoryRouter from './category.js';

const router = express.Router();

router.use(examineeRouter);
router.use(locationRouter);
router.use(serveyRouter);
router.use(categoryRouter);

export default router;
