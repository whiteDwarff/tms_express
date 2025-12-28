import { ApiResponse } from '#root/api/utils/response.js';
import service from '../service/examCategoryService.js';

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

export default {
  findAll,
};
