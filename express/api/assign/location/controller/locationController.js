import service from '../service/locationService.js';
import { ApiResponse } from '../../../utils/response.js';

// 시험장 목록  및 개수 조회
const findAllLocation = async (req, res) => {
  try {
    const params = req.query;
    const result = await service.findAllLocation(params);
    ApiResponse.success(res, result);
  } catch (err) {
    console.error(err);
    ApiResponse.error(res, err);
  }
};

// 응시자정보 사용유무 변경
const updateLocationUseFlag = async (req, res) => {
  try {
    const result = await service.updateLocationUseFlag(req.body);
    if (result?.message) ApiResponse.error(res, result, 201);
    else ApiResponse.success(res, result);
  } catch (err) {
    console.error(err);
    ApiResponse.error(res, err);
  }
};

export default {
  findAllLocation,
  updateLocationUseFlag,
};
