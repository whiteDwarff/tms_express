import examInfoRepository from "../repository/examInfoRepository.js";

const findAllExamInfo = async (params) => {
  try {
    // 리스트와 개수를 일괄 조회
    const [list, count] = await Promise.all([
      examInfoRepository.findAllExamInfo(params),
      examInfoRepository.findExamInfoCount(params),
    ]);
    return { list, count };
  } catch (err) {
    console.log(`[Service] findAllExamInfo :: ${err}`);
    throw err;
  }
};

export default {
  findAllExamInfo,
};
