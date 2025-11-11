import examInfoService from "../service/examInfoService.js";
import { ApiResponse } from "../../utils/response.js";

// 시험목록 및 개수 조회
const findAllExamInfo = async (req, res) => {
  try {
    const params = req.query;
    const result = await examInfoService.findAllExamInfo(params);
    ApiResponse.success(res, result);
  } catch (err) {
    console.log(err);
    ApiResponse.error(res, err);
  }
};
// 시험정보 사용유무 변경
const updateExamInfoUseFlag = async (req, res) => {
  try {
    console.log(req.params.examCode);
    const result = await examInfoService.updateExamInfoUseFlag(
      req.params?.examCode
    );
    if (result.message) ApiResponse.error(res, err, 201);
    else ApiResponse.success(res, result);
  } catch (err) {
    console.log(err);
    ApiResponse.error(res, err);
  }
};

export default {
  findAllExamInfo,
  updateExamInfoUseFlag,
};
