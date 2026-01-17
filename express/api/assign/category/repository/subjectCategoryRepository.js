import db from '#root/db/index.js';
import query from './subjectSql.js';

/**
 * 교과목분류 목록 조회
 * @returns {object}      - 검색결과
 */
const findAll = async () => {
  const sql = query.buildFindSubjectCategoryList();
  return await db.query(sql);
};
/**
 * 교과목분류 등록
 * @param {object} form  - 교과목분류 정보
 * @returns {number}     - 교과목분류pk
 */
const insertSubjectCategory = async (form, client) => {
  const sql = query.buildInsertSubjectCategory(form);
  return await db.query(sql, client);
}
/**
 * 교과목분류 수정
 * @param {object} form  - 교과목분류 정보
 * @returns {number}     - 교과목분류pk
 */
const updateSubjectCategory = async (form, client) => {
  const sql = query.buildUpdateSubjectCategory(form);
  return await db.query(sql, client);
}
/**
 * 분류별 교과목 목록 조회
 * @param {object} form  - 교과목분류 정보
 */
const findSubjectCategoryByDepth = async (form) => {
  const sql = query.buildFindSubjectCategoryByDepth(form);
  return await db.query(sql);
}


export default {
  findAll,
  insertSubjectCategory,
  updateSubjectCategory,
  findSubjectCategoryByDepth
};
