import pool from '#root/db/pool.js';
import { validNumber } from '#root/common/validate-rules.js';
import {
  ValidationError,
  NotFoundError,
  DatabaseError,
  serviceErrorHandler,
} from '#root/error/index.js';
import repository from '../repository/locationRepository.js';

/**
 * 시험장 목록과 총 개수 조회
 * @param {object} params - 검색조건
 * @returns               - 결과
 */
const findAllLocation = async (params) => {
  try {
    const [{ rows: list }, count] = await Promise.all([
      repository.findAllLocation(params),
      repository.findAllLocationCount(params),
    ]);
    return { list, count };
  } catch (err) {
    throw serviceErrorHandler(err);
  }
};
/**
 * 시험장 목록 사용여부 변경
 * @param {object} params - body
 * @returns               - 결과
 */
const updateLocationUseFlag = async (params) => {
  // 커넥션풀에서 하나의 커넥션을 가져온다
  const client = await pool.connect();

  try {
    const examroomCode = params?.examroomCode || [];
    // 삭제할 데이터가 없는 경우
    if (!examroomCode.length) throw new ValidationError('삭제 실패하였습니다.');

    const count = await repository.updateLocationUseFlag(examroomCode, client);
    // 삭제된 데이터가 없는 경우
    if (!count) throw new NotFoundError('삭제 실패하였습니다.');

    await client.query('COMMIT');
    return { count };
  } catch (err) {
    // 오류가 발생한다면 롤백
    await client.query('ROLLBACK');
    throw serviceErrorHandler(err);
  } finally {
    // 커넥션 반납
    client.release();
  }
};
/**
 * 시험장 등록 및 수정
 * @param {object} params - 시험장 객체
 * @returns               - 결과
 */
const editLocation = async (params) => {
  // 등록, 수정 여부 확인
  const hasExamroomCode = params.examroomCode;
  let examroomCode = null;

  // 커넥션풀에서 하나의 커넥션을 가져온다
  const client = await pool.connect();
  try {
    // 트랜잭션 시작
    await client.query('BEGIN');

    // 시험장 저장 결과
    let location = {};

    if (!hasExamroomCode) {
      location = await repository.insertExamRoom(params, client);
    } else location = await repository.updateExamRoom(params, client);
    // 등록 및 수정 결과가 있다면 상세정보 처리
    if (location.rowCount) {
      examroomCode = location.rows[0].examroomCode;
      for (let roomNum of params.roomNumInfo) {
        // 최초 등록
        if (!roomNum.examroomNumCode) {
          roomNum.examroomCode = examroomCode;
          await repository.insertExamRoomNum(roomNum, client);
          // 수정
        } else await repository.updateExamRoomNum(roomNum, client);
      }
      // try에서 오류가 나지 않는다면 커밋
      await client.query('COMMIT');
    } else throw new DatabaseError(`시험장 ${!hasExamroomCode ? '등록' : '수정'} 실패하였습니다.`);

    return {
      count: location.rowCount,
    };
  } catch (err) {
    // 오류가 발생한다면 롤백
    await client.query('ROLLBACK');
    throw serviceErrorHandler(err);
  } finally {
    // 커넥션 반납
    client.release();
  }
};
/**
 * 시험장 상세 조회
 * @param {number} excmroomCode - 시험장pk
 * @returns {object}            - 결과
 */
const findLocation = async (excmroomCode) => {
  if (!excmroomCode || !validNumber(excmroomCode)) throw new ValidationError('잘못된 접근 입니다.');
  const { rows } = await repository.findLocation(excmroomCode);

  if (rows.length) return rows[0];

  throw new NotFoundError('시험장을 찾을 수 없습니다.');
};

export default {
  findAllLocation,
  updateLocationUseFlag,
  editLocation,
  findLocation,
};
