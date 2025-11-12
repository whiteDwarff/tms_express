import repository from '../repository/examineeRepository.js';
import pool from '../../../../db/pool.js';

/**
 * 응시자 목록과 총 개수 조회
 * @param {object} params - 검색조건
 * @returns - 결과
 */
const findAllExamineeInfo = async (params) => {
  const [{ rows: list }, count] = await Promise.all([
    repository.findAllExamineeInfo(params),
    repository.findAllExamineeCount(params),
  ]);
  return { list, count };
};

export default {
  findAllExamineeInfo,
};
