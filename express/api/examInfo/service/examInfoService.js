import examInfoRepository from '../repository/examInfoRepository.js';
import pool from '../../../db/pool.js';

/**
 * 시험정보 목록과 총 개수 조회
 * @param {object} params - 검색조건
 * @returns - 결과
 */
const findAllExamInfo = async (params) => {
  // 리스트와 개수를 일괄 조회
  const [{ rows: list }, count] = await Promise.all([
    examInfoRepository.findAllExamInfo(params),
    examInfoRepository.findExamInfoCount(params),
  ]);
  return { list , count };
};
/**
 * 시험정보 사용유무 변경
 * @param {object} examCode - 시험정보pk
 * @returns - 결과
 */
const updateExamInfoUseFlag = async (examCode) => {
  const result = {};
  if (examCode) {
    const count = await examInfoRepository.updateExamInfoUseFlag(examCode);
    if (!count) result.message = '삭제 실패하였습니다.';
  } else result.message = '필수 값 examCode가 누락되었습니다.';
  return result;
};
/**
 * 시험정보 등록 및 수정
 * @param {object} params - 시험정보 객체
 * @returns - 결과
 */
const editExamInfo = async (params) => {
  const result = {};
  // 등록, 수정 여부 확인
  const hasExamCode = params.examCode;
  let examCode = null;

  // 커넥션풀에서 하나의 커넥션을 가져온다
  const client = await pool.connect();
  try {
    // 트랜잭션 시작
    await client.query('BEGIN');

    // 시험정보의 저장 결과
    let examInfo = [];

    if (!hasExamCode) {
      examInfo = await examInfoRepository.insertExamInfo(params, client);
    } else examInfo = await examInfoRepository.updateExamInfo(params, client);
    // 등록 및 수정 결과가 있다면 상세정보 처리
    if (examInfo.rowCount) {
      examCode = examInfo.rows[0].examCode;
      for (let [i, item] of params.details.entries()) {
        item.examOrder = i + 1;
        // 최초 등록
        if (!item.examFormCode) {
          item.examCode = examCode;
          await examInfoRepository.insertExamFormInfo(item, client);
          // 수정
        } else await examInfoRepository.updateExamFormInfo(item, client);
      }
      // try에서 오류가 나지 않는다면 커밋
      await client.query('COMMIT');
    } else result.message = `시험정보 ${!hasExamCode ? '등록' : '수정'} 실패하였습니다.`;

    return result;
  } catch (err) {
    // 오류가 발생한다면 롤백
    await client.query('ROLLBACK');
    console.error('트랜잭션 롤백', err);
    throw err;
  } finally {
    // 커넥션 반납
    client.release();
  }
};
/**
 * 시험정보 상세 조회
 * @param {number} examCode - 시험정보pk
 * @returns {object}        - 결과
 */
const findExamInfo = async (examCode) => {
  let result = {};
  if(!examCode || isNaN(examCode)) {
    result.message = '잘못된 접근 입니다.';
    return result;
  }
  const { rows } = await examInfoRepository.findExamInfo(examCode);

  if(rows.length) return rows[0];

  result.message = '조회된 시험정보가 없습니다.';
  return result;
}

export default {
  findAllExamInfo,
  updateExamInfoUseFlag,
  editExamInfo,
  findExamInfo,
};
