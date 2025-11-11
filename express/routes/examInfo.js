import express from 'express';
import examInfoController from '../api/examInfo/controller/examInfoController.js';

const router = express.Router();
// 목록 조회
router.get('/examInfo', examInfoController.findAllExamInfo);
// 시험정보 사용유무 변경
router.patch('/examInfo/updateUseFlag/:examCode', examInfoController.updateExamInfoUseFlag);
// 시험정보 등록 및 수정
router.post('/examInfo/edit', examInfoController.editExamInfo);

export default router;
