import db from "../../../db/index.js";
import { buildExamInfoCountQuery, buildExamInfoListQuery } from "./sql.js";
import { extractCount } from "../../../db/utils.js";
/**
 * 시험정보 목록 조회
 * @param {object} params - 검색조건
 * @returns {object}      - 검색결과
 */
const findAllExamInfo = async (params) => {
  try {
    let sql = buildExamInfoListQuery(params);
    return await db.query(sql);
  } catch (err) {
    console.log(`[Repository] findAllExamInfo :: ${err}`);
    throw err;
  }
};
/**
 * 검색조건과 일치한 총 개수 조회
 * @param {object} params - 검색조건
 * @returns {number}      - 총 개수
 */
const findExamInfoCount = async (params) => {
  try {
    let sql = buildExamInfoCountQuery(params);
    const count = await db.query(sql);
    const totalCount = extractCount(count);
    return totalCount;
  } catch (err) {
    console.log(`[Repository] findExamInfoCount :: ${err}`);
    throw err;
  }
};

export default {
  findAllExamInfo,
  findExamInfoCount,
};
