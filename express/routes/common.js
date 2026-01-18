import express from 'express';
import controller from '#root/api/common/commonController.js';
import upload from '#root/middleware/uploadMiddleware.js';

const router = express.Router();

// 에디터 첨부파일 등록
router.post('/editor/imageUpload', upload.array('file'), controller.editorImageUpload);

router.post('/imageGen/imageFromPrompt', controller.generateImageFromPrompt);

export default router;
