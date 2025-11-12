import express from 'express';
import controller from '../../api/assign/examinee/controller/examineeController.js';

const router = express.Router();

// 목록 조회
router.get('/assign/examinee', controller.findAllExamineeInfo);

export default router;