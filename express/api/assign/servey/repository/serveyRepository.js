import db from '#root/db/index.js';
import { extractCount } from '#root/db/utils.js';
import query from './sql.js';

/**
 * 설문 목록 조회
 * @param {object} params - 검색조건
 * @returns {object}      - 검색결과
 */
const findAll = async (params) => {
  const sql = query.buildSurveyList(params);
  return await db.query(sql);
};
/**
 * 검색조건과 일치한 총 개수 조회
 * @param {object} params - 검색조건
 * @returns {number}      - 총 개수
 */
const findListCount = async (params) => {
  const sql = query.buildSurveyCount(params);
  const result = await db.query(sql);
  // 배열에서 count 추출
  return extractCount(result.rows);
};
/**
 * 설문 사용여부 변경
 * @param {array} researchCode - 설문pk 목록
 * @returns {number}
 */
const updateUseFlag = async (researchCode, client) => {
  const sql = query.buildUpdateResearchUseFlag(researchCode);
  return await db.execute(sql, client);
};
/**
 * 설문 등록
 * @param {object} form - 설문정보
 * @returns {object}
 */
const insertSurvey = async (form, client) => {
  const sql = query.buildInsertSurvey(form);
  return await db.query(sql, client);
};
/**
 * 설문 수정
 * @param {object} form - 설문정보
 * @returns {object}
 */
const updateSurvey = async (form, client) => {
  const sql = query.buildUpdateServey(form);
  return await db.query(sql, client);
};
/**
 * 설문 등록
 * @param {object} form - 설문정보
 * @returns {object}
 */
const insertSurveyItem = async (form, client) => {
  const sql = query.buildInsertSurveyItem(form);
  return await db.query(sql, client);
};
/**
 * 설문 수정
 * @param {object} form - 설문정보
 * @returns {object}
 */
const updateSurveyItem = async (form, client) => {
  const sql = query.buildUpdateSurveyItem(form);
  return await db.query(sql, client);
};
/**
 * 설문 상세 조회
 * @param {number} researchCode - 설문pk
 * @returns {object}
 */
const findServey = async (researchCode) => {
  const sql = query.buildFindServey(researchCode);
  return await db.query(sql);
};

export default {
  findAll,
  findListCount,
  updateUseFlag,
  insertSurvey,
  updateSurvey,
  insertSurveyItem,
  updateSurveyItem,
  findServey,
};
