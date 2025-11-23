import service from '../service/serveyService.js';
import { ApiResponse } from '../../../utils/response.js';

// 설문 목록 및 개수 조회
const findAll = async (req, res) => {
  try {
    const params = req.query;
    const result = await service.findAll(params);
    ApiResponse.success(res, result);
  } catch (err) {
    console.error(err);
    ApiResponse.error(res, err);
  }
};

// 설문 사용유무 변경
const updateUseFlag = async (req, res) => {
  try {
    const result = await service.updateUseFlag(req.body);
    if (result?.message) ApiResponse.error(res, result, 201);
    else ApiResponse.success(res, result);
  } catch (err) {
    console.error(err);
    ApiResponse.error(res, err);
  }
};

// 설문 등록 및 수정
const editServey = async (req, res) => {
  try {
    const result = await service.editSurvey(req.body);
    if (result?.message) ApiResponse.error(res, result, 201);
    else ApiResponse.success(res, result);
  } catch (err) {
    console.error(err);
    ApiResponse.error(res, err);
  }
};

export default {
  findAll,
  updateUseFlag,
  editServey,
};
