import examInfoService from "../service/examInfoService.js";
import { ApiResponse } from "../../utils/response.js";

const findAllExamInfo = async (req, res) => {
  try {
    const params = req.query;
    const result = await examInfoService.findAllExamInfo(params);
    ApiResponse.success(res, result);
  } catch (err) {
    ApiResponse.error(res, err);
  }
};

const updateExamInfoUseFlag = async (req, res) => {
  try {
    const params = req.query;
    const result = await examInfoService.updateExamInfoUseFlag(params);
    if(result.message) 
      ApiResponse.error(res, err, 201);
    else ApiResponse.success(res, result);
  } catch (err) {
    ApiResponse.error(res, err);
  }
};

export default {
  findAllExamInfo,
  updateExamInfoUseFlag
};
