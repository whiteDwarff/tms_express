import { ApiResponse } from '#root/api/utils/response.js';
import service from '../service/serveyService.js';

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
    ApiResponse.success(res, result);
  } catch (err) {
    ApiResponse.error(res, err);
  }
};

// 설문 등록 및 수정
const editServey = async (req, res) => {
  try {
    const result = await service.editSurvey(req.body);
    ApiResponse.success(res, result);
  } catch (err) {
    ApiResponse.error(res, err);
  }
};

// 설문 상세조회
const findServey = async (req, res) => {
  try {
    const result = await service.findServey(req.params?.researchCode);
    ApiResponse.success(res, result);
  } catch (err) {
    ApiResponse.error(res, err);
  }
};

export default {
  findAll,
  updateUseFlag,
  editServey,
  findServey,
};
