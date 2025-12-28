import express from 'express';
import controller from '#root/api/assign/category/controller/examCategoryController.js';

const router = express.Router();

// 목록 조회
router.get('/assign/examCategory', controller.findAll);

export default router;
