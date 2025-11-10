import examInfoRepository from "../repository/examInfoRepository.js";

/**
 * 시험정보 목록과 총 개수 조회
 * @param {object} params - 검색조건 
 * @returns - 결과
 */
const findAllExamInfo = async (params) => {
    // 리스트와 개수를 일괄 조회
    const [list, count] = await Promise.all([
      examInfoRepository.findAllExamInfo(params),
      examInfoRepository.findExamInfoCount(params),
    ]);
    return { list, count };
};
/**
 * 시험정보 삭제
 * @param {object} evalCode - 시험정보pk 
 * @returns - 결과
 */
const updateExamInfoUseFlag = async (evalCode) => {
  const result = {};
  if(evalCode) {
    const count = examInfoRepository.updateExamInfoUseFlag(params.evalCode);
    if(!count) result.message = '삭제 실패하였습니다.';
  } else result.message = '필수 값 examCode가 누락되었습니다.';
  return result;
}

export default {
  findAllExamInfo,
  updateExamInfoUseFlag
};
