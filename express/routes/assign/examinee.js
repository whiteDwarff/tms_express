import express from 'express';
import controller from '../../api/assign/examinee/controller/examineeController.js';

const router = express.Router();

// 목록 조회
router.get('/assign/examinee', controller.findAllExamineeInfo);
// 사용여부 변경
router.patch('/assign/examinee/updateUseFlag', controller.updatExamineeUseFlag);

export default router;