import express from 'express';
import controller from '#root/api/assign/category/controller/examCategoryController.js';

const router = express.Router();

// 시험분류 목록 조회
router.get('/assign/examCategory', controller.findAll);
// 시험분류 등록 및 수정
router.post('/assign/examCategoryEdit', controller.editExamCategory);

export default router;
