import express from 'express';
import controller from '../../api/assign/servey/controller/serveyController.js';

const router = express.Router();

// 목록 조회
router.get('/assign/servey', controller.findAll);
// 사용여부 변경
router.patch('/assign/servey/updateUseFlag', controller.updateUseFlag);
// 등록 및 수정
router.post('/assign/servey/edit', controller.editServey);
// // 상세조회
// router.get('/assign/location/:examroomCode', controller.findLocation);

export default router;
