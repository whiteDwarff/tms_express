import { ApiResponse } from '#root/api/utils/response.js';
import service from '../service/examCategoryService.js';

// 시험분류 목록 조회
const findAll = async (req, res) => {
  try {
    const result = await service.findAll();
    ApiResponse.success(res, result); 
  } catch (err) {
    console.error(err);
    ApiResponse.error(res, err);
  }
};
// 시험분류 목록 등록 및 수정
const editExamCategory = async (req, res) => {
  try {
    ApiResponse.success(res, await service.editExamCategory(req.body));
  } catch (err) {
    console.error(err);
    ApiResponse.error(res, err);
  }
};

export default {
  findAll,
  editExamCategory
};
