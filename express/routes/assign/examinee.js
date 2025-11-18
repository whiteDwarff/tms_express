import express from 'express';
import controller from '../../api/assign/examinee/controller/examineeController.js';
import upload from '../../middleware/uploadMiddleware.js';

const router = express.Router();

// 목록 조회
router.get('/assign/examinee', controller.findAllExamineeInfo);
// 사용여부 변경
router.patch('/assign/examinee/updateUseFlag', controller.updatExamineeUseFlag);
// 응시자 등록 및 수정
router.post('/assign/examinee/edit', upload.single('profile'), controller.examineeEdit);

export default router;
