import examInfoService from '../service/examInfoService.js';
import { ApiResponse } from '../../utils/response.js';

// 시험목록 및 개수 조회
const findAllExamInfo = async (req, res) => {
  try {
    const params = req.query;
    const result = await examInfoService.findAllExamInfo(params);
    ApiResponse.success(res, result);
  } catch (err) {
    console.error(err);
    ApiResponse.error(res, err);
  }
};
// 시험정보 사용유무 변경
const updateExamInfoUseFlag = async (req, res) => {
  try {
    const result = await examInfoService.updateExamInfoUseFlag(req.params?.examCode);
    if (result.message) ApiResponse.error(res, result, 201);
    else ApiResponse.success(res, result);
  } catch (err) {
    console.error(err);
    ApiResponse.error(res, err);
  }
};
// 시험정보 등록 및 수정
const editExamInfo = async (req, res) => {
  try {
    const result = await examInfoService.editExamInfo(req.body);
    if (result.message) ApiResponse.error(res, result, 201);
    else ApiResponse.success(res, result);
  } catch (err) {
    console.error(err);
    ApiResponse.error(res, err);
  }
};
// 시험목록 상세 조회
const findExamInfo = async (req, res) => {
  try {
    const result = await examInfoService.findExamInfo(req.params?.examCode);
    if(result.message) ApiResponse.error(res, result, 201);
    else ApiResponse.success(res, result);
  } catch (err) {
    console.error(err);
    ApiResponse.error(res, err);
  }
};

export default {
  findAllExamInfo,
  updateExamInfoUseFlag,
  editExamInfo,
  findExamInfo
};
