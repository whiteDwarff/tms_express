import service from './commonService.js';
import { ApiResponse } from '#root/api/utils/response.js';

// 에디터 이미지 등록
const editorImageUpload = async (req, res) => {
  try {
    const files = req?.files;
    const body = req.body;
    const result = await service.editorImageUpload(body, files);
    ApiResponse.success(res, result);
  } catch (err) {
    ApiResponse.error(res, err);
  }
};
// 이미지 생성
const generateImageFromPrompt = async (req, res) => {
  try {
    const body = req.body;
    const result = await service.generateImageFromPrompt(body);
    ApiResponse.success(res, result);
  } catch (err) {
    ApiResponse.error(res, err);
  }
};

export default {
  editorImageUpload,
  generateImageFromPrompt
};
