import db from '#root/db/index.js';
import { extractCount } from '#root/db/utils.js';
import query from './examSql.js';

/**
 * 시험분류 목록 조회
 * @returns {object}      - 검색결과
 */
const findAll = async (params) => {
  const sql = query.buildFindExamCategoryList();
  return await db.query(sql);
};

export default {
  findAll,
};
