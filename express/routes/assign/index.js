import express from 'express';

import examineeRouter from './examinee.js';
import locationRouter from './location.js';
import serveyRouter from './servey.js';
import examCategoryRouter from './examCategory.js';

const router = express.Router();

router.use(examineeRouter);
router.use(locationRouter);
router.use(serveyRouter);
router.use(examCategoryRouter);

export default router;
