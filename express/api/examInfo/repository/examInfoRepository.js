import db from '#root/db/index.js';
import { extractCount } from '#root/db/utils.js';
import query from './sql.js';

/**
 * 시험정보 목록 조회
 * @param {object} params - 검색조건
 * @returns {object}      - 검색결과
 */
const findAllExamInfo = async (params) => {
  const sql = query.buildExamInfoList(params);
  return await db.query(sql);
};
/**
 * 검색조건과 일치한 총 개수 조회
 * @param {object} params - 검색조건
 * @returns {number}      - 총 개수
 */
const findExamInfoCount = async (params) => {
  const sql = query.buildExamInfoCount(params);
  const result = await db.query(sql);
  // 배열에서 count 추출
  return extractCount(result.rows);
};
/**
 * 시험정보 useFlag 변경(삭제 처리)
 * @param {number} examCode - 시험정보pk
 * @returns {number}        - 삭제 개수
 */
const updateExamInfoUseFlag = async (examCode) => {
  const sql = query.buildDeleteExamInfo(examCode);
  return await db.execute(sql);
};
/**
 * 시험정보 둥록
 * @param {object} params - 시험정보
 * @returns {number}
 */
const insertExamInfo = async (params, client) => {
  const sql = query.buildInsertExamInfo(params);
  return await db.query(sql, client);
};
/**
 * 시험상세정보 둥록
 * @param {object} params - 시험상세정보
 */
const insertExamFormInfo = async (params, client) => {
  const sql = query.buildInsertExamFormInfo(params);
  return await db.query(sql, client);
};
/**
 * 시험정보 수정
 * @param {object} params - 시험정보
 * @returns {number}
 */
const updateExamInfo = async (params, client) => {
  const sql = query.buildUpdateExamInfo(params);
  return await db.query(sql, client);
};
/**
 * 시험상세정보 수정
 * @param {object} params - 시험상세정보
 */
const updateExamFormInfo = async (params, client) => {
  const sql = query.buildUpdateExamFormInfo(params);
  return await db.query(sql, client);
};
/**
 * 시험정보 상세 조회
 * @param {number} examCode - 시험정보pk
 * @returns {object}        - 검색결과
 */
const findExamInfo = async (examCode) => {
  const sql = query.buildFindExamInfo(examCode);
  return await db.query(sql);
};

export default {
  findAllExamInfo,
  findExamInfoCount,
  updateExamInfoUseFlag,
  insertExamInfo,
  insertExamFormInfo,
  updateExamInfo,
  updateExamFormInfo,
  findExamInfo,
};
