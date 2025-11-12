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

export default {
  findAllExamineeInfo,
}