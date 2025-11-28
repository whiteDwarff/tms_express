import db from '#root/db/index.js';
import { extractCount } from '#root/db/utils.js';
import query from './sql.js';

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
 * @param {array} examroomCode - 시험장pk 목록
 * @returns {number}
 */
const updateLocationUseFlag = async (examroomCode, client) => {
  const sql = query.buildUpdateLocationUseFlag(examroomCode);
  return await db.execute(sql, client);
};
/**
 * 시험장 등록
 * @param {object} form - 시험장 정보
 * @returns {object}    - 등록 결과
 */
const insertExamRoom = async (form, client) => {
  const sql = query.buildInsertExamRoom(form, client);
  return await db.query(sql);
};
/**
 * 시험장 수정
 * @param {object} form - 시험장 정보
 * @returns {object}    - 등록 결과
 */
const updateExamRoom = async (form, client) => {
  const sql = query.buildUpdateExamRoom(form, client);
  return await db.query(sql);
};
/**
 * 호실 등록
 * @param {object} form - 호실 정보
 * @returns {object}    - 등록 결과
 */
const insertExamRoomNum = async (form, client) => {
  const sql = query.buildInsertExamRoomNum(form, client);
  return await db.query(sql);
};
/**
 * 호실 수정
 * @param {object} form - 호실 정보
 * @returns {object}    - 등록 결과
 */
const updateExamRoomNum = async (form, client) => {
  const sql = query.buildUpdateExamRoomNum(form, client);
  return await db.query(sql);
};
/**
 * 시험장 상세 조회
 * @param {number} excmroomCode - 시험장pk
 * @returns {object}            - 검색결과
 */
const findLocation = async (excmroomCode) => {
  const sql = query.buildFindLocation(excmroomCode);
  return await db.query(sql);
};

export default {
  findAllLocation,
  findAllLocationCount,
  updateLocationUseFlag,
  insertExamRoom,
  updateExamRoom,
  insertExamRoomNum,
  updateExamRoomNum,
  findLocation,
};
