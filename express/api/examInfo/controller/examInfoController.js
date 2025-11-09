import examInfoService from "../service/examInfoService.js";

const findAllExamInfo = async (req, res, next) => {
  try {
    const params = req.query;
    const result = await examInfoService.findAllExamInfo(params);

    res.status(200).json({
      status: 200,
      message: "success",
      result: result,
    });
  } catch (err) {
    console.error(`[Controller] findAllExamInfo :: ${err}`);

    res.status(500).json({
      status: 500,
      message: err.message,
      result: err,
    });
  }
};

export default {
  findAllExamInfo,
};
