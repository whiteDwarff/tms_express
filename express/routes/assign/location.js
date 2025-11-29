import express from 'express';
import controller from '#root/api/assign/location/controller/locationController.js';

const router = express.Router();

// 목록 조회
router.get('/assign/location', controller.findAllLocation);
// 사용여부 변경
router.patch('/assign/location/updateUseFlag', controller.updateLocationUseFlag);
// 등록 및 수정
router.post('/assign/location/edit', controller.editLocation);
// 상세조회
router.get('/assign/location/:examroomCode', controller.findLocation);

export default router;
