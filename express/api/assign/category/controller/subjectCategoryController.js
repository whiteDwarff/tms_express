import { ApiResponse } from '#root/api/utils/response.js';
import service from '../service/subjectCategoryService.js';

// 교과목분류 목록 조회
const findAll = async (req, res) => {
  try {
    const result = await service.findAll();
    ApiResponse.success(res, result); 
  } catch (err) {
    console.error(err);
    ApiResponse.error(res, err);
  }
};
// 교과목분류 목록 등록 및 수정
const editSubjectCategory = async (req, res) => {
  try {
    ApiResponse.success(res, await service.editSubjectCategory(req.body));
  } catch (err) {
    console.error(err);
    ApiResponse.error(res, err);
  }
};
// 분류별 교과목 목록 조회
const findByDepth = async (req, res) => {
  try {
    const result = await service.findByDepth(req.query);
    ApiResponse.success(res, result); 
  } catch (err) {
    console.error(err);
    ApiResponse.error(res, err);
  }
};


export default {
  findAll,
  editSubjectCategory,
  findByDepth
};
