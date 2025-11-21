import db from '../../../../db/index.js';
import query from './sql.js';
import { extractCount } from '../../../../db/utils.js';

/**
 * 시험장 목록 조회
 * @param {object} params - 검색조건
 * @returns {object}      - 검색결과
 */
const findAllLocation = async (params) => {
  const sql = query.buildLocationList(params);
  return await db.query(sql);
};
/**
 * 검색조건과 일치한 총 개수 조회
 * @param {object} params - 검색조건
 * @returns {number}      - 총 개수
 */
const findAllLocationCount = async (params) => {
  const sql = query.buildLocationCount(params);
  const result = await db.query(sql);
  // 배열에서 count 추출
  return extractCount(result.rows);
};
/**
 * 시험장 사용여부 변경
 * @param {array} examroomCode - 시험장 정보pk
 * @returns {number}
 */
const updateLocationUseFlag = async (examroomCode, client) => {
  const sql = query.buildUpdateLocationUseFlag(examroomCode);
  return await db.execute(sql, client);
};

export default {
  findAllLocation,
  findAllLocationCount,
  updateLocationUseFlag,
};
