import express from 'express';
import controller from '../../api/assign/location/controller/locationController.js';

const router = express.Router();

// 목록 조회
router.get('/assign/location', controller.findAllLocation);
// 사용여부 변경
router.patch('/assign/location/updateUseFlag', controller.updateLocationUseFlag);

export default router;
