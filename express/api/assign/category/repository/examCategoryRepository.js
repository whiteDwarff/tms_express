import db from '#root/db/index.js';
import query from './examSql.js';

/**
 * 시험분류 목록 조회
 * @returns {object}      - 검색결과
 */
const findAll = async () => {
  const sql = query.buildFindExamCategoryList();
  return await db.query(sql);
};
/**
 * 시험분류 등록
 * @param {object} form  - 시험분류 정보
 * @returns {number}     - 시험분류pk
 */
const insertExamCategory = async (form, client) => {
  const sql = query.buildInsertExamCategory(form);
  return await db.query(sql, client);
}
/**
 * 시험분류 수정
 * @param {object} form  - 시험분류 정보
 * @returns {number}     - 시험분류pk
 */
const updateExamCategory = async (form, client) => {
  const sql = query.buildUpdateExamCategory(form);
  return await db.query(sql, client);
}
/**
 * 분류별 시험 목록 조회
 * @param {object} form  - 시험분류 정보
 */
const findExamCategoryByDepth = async (form) => {
  const sql = query.buildFindExamCategoryByDepth(form);
  return await db.query(sql);
}

export default {
  findAll,
  insertExamCategory,
  updateExamCategory,
  findExamCategoryByDepth
};
