import db from "../../../db/index.js";
import { 
  buildExamInfoCountQuery, 
  buildExamInfoListQuery, 
  buildDeleteExamInfoQuery 
} from "./sql.js";
import { extractCount } from "../../../db/utils.js";
/**
 * 시험정보 목록 조회
 * @param {object} params - 검색조건
 * @returns {object}      - 검색결과
 */
const findAllExamInfo = async (params) => {
  const sql = buildExamInfoListQuery(params);
  return await db.query(sql);
};
/**
 * 검색조건과 일치한 총 개수 조회
 * @param {object} params - 검색조건
 * @returns {number}      - 총 개수
 */
const findExamInfoCount = async (params) => {
  const sql = buildExamInfoCountQuery(params);
  const count = await db.query(sql);
  // 배열에서 count 추출
  const totalCount = extractCount(count);
  return totalCount;
};
/**
 * 시험정보 useFlag 변경(삭제 처리)
 * @param {number} examCode - 시험정보pk
 * @returns {number}        - 삭제 개수
 */
const updateExamInfoUseFlag = async (examCode) => {
  const sql = buildDeleteExamInfoQuery(examCode);
  const result = await db.query(sql);
  return result.rowCount;
};

export default {
  findAllExamInfo,
  findExamInfoCount,
  updateExamInfoUseFlag
};
