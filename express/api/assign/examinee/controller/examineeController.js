import service from '../service/examineeService.js';
import { ApiResponse } from '../../../utils/response.js';

// 응시자 목록  및 개수 조회
const findAllExamineeInfo = async (req, res) => {
  try {
    const params = req.query;
    const result = await service.findAllExamineeInfo(params);
    ApiResponse.success(res, result);
  } catch (err) {
    console.error(err);
    ApiResponse.error(res, err);
  }
};

// 응시자정보 사용유무 변경
const updateExamineeUseFlag = async (req, res) => {
  try {
    const result = await service.updateExamineeUseFlag(req.body);
    if (result?.message) ApiResponse.error(res, result, 201);
    else ApiResponse.success(res, result);
  } catch (err) {
    console.error(err);
    ApiResponse.error(res, err);
  }
};

// 응시자정보 등록 및 수정
const examineeEdit = async (req, res) => {
  try {
    const file = req?.file;
    const body = req.body;

    const result = await service.examineeEdit(body, file);
    if (result?.message) ApiResponse.error(res, result, 201);
    else ApiResponse.success(res, result);
  } catch (err) {
    console.error(err);
    ApiResponse.error(res, err);
  }
};

// 응시자 상세조회
const findExaminee = async (req, res) => {
  try {
    const result = await service.findExaminee(req.params?.examineeCode);
    if (result?.message) ApiResponse.error(res, result, 201);
    else ApiResponse.success(res, result);
  } catch (err) {
    console.error(err);
    ApiResponse.error(res, err);
  }
}

export default {
  findAllExamineeInfo,
  updateExamineeUseFlag,
  examineeEdit,
  findExaminee
};
