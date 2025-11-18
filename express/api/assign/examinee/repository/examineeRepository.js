import db from '../../../../db/index.js';
import query from './sql.js';
import { extractCount } from '../../../../db/utils.js';

/**
 * 응시자 목록 조회
 * @param {object} params - 검색조건
 * @returns {object}      - 검색결과
 */
const findAllExamineeInfo = async (params) => {
  const sql = query.buildExamineeList(params);
  return await db.query(sql);
};
/**
 * 검색조건과 일치한 총 개수 조회
 * @param {object} params - 검색조건
 * @returns {number}      - 총 개수
 */
const findAllExamineeCount = async (params) => {
  const sql = query.buildExamineeCount(params);
  const result = await db.query(sql);
  // 배열에서 count 추출
  return extractCount(result.rows);
};
/**
 * 응시자 사용여부 변경
 * @param {number} examineeCode - 응시자 정보pk
 * @returns {number}
 */
const updatExamineeUseFlag = async (examineeCode, client) => {
  const sql = query.buildUpdateExamineeUseFlag(examineeCode);
  return await db.execute(sql, client);
};
/**
 * 중복된 응시번호 확인
 * @param {string} examineeId - 응시번호
 * @returns {number}
 */
const examineeIdDuplicatedCheck = async (examineeId) => {
  const sql = query.buildExamineeIdDuplicatedCheck(examineeId);
  const result = await db.query(sql);
  // 배열에서 count 추출
  return extractCount(result.rows);
};
/**
 * 응시자 등록
 * @param {object} params - 응시자 정보
 * @returns {number}
 */
const insertExaminee = async (params) => {
  const sql = query.buildInsertExaminee(params);
  return await db.execute(sql);
};

export default {
  findAllExamineeInfo,
  findAllExamineeCount,
  updatExamineeUseFlag,
  examineeIdDuplicatedCheck,
  insertExaminee,
};
