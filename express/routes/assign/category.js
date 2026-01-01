import express from 'express';
import examController from '#root/api/assign/category/controller/examCategoryController.js';
import subjectController from '#root/api/assign/category/controller/subjectCategoryController.js';

const router = express.Router();

// 시험분류 목록 조회
router.get('/assign/examCategory', examController.findAll);
// 시험분류 등록 및 수정
router.post('/assign/examCategoryEdit', examController.editExamCategory);

// 교과목분류 목록 조회
router.get('/assign/subjectCategory', subjectController.findAll);
// 교과목분류 등록 및 수정
router.post('/assign/subjectCategoryEdit', subjectController.editSubjectCategory);

export default router;
