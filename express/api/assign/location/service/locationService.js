import repository from '../repository/locationRepository.js';
import pool from '../../../../db/pool.js';
import { validNumber } from '../../../../common/validate-rules.js';
/**
 * 시험장 목록과 총 개수 조회
 * @param {object} params - 검색조건
 * @returns               - 결과
 */
const findAllLocation = async (params) => {
  const [{ rows: list }, count] = await Promise.all([
    repository.findAllLocation(params),
    repository.findAllLocationCount(params),
  ]);
  return { list, count };
};
/**
 * 시험장 목록 사용여부 변경
 * @param {object} params - body
 * @returns               - 결과
 */
const updateLocationUseFlag = async (params) => {
  const result = {};
  // 커넥션풀에서 하나의 커넥션을 가져온다
  const client = await pool.connect();

  try {
    const examroomCode = params?.examroomCode || [];
    // 삭제할 데이터가 없는 경우
    if (!examroomCode.length) {
      result.message = '삭제 실패하였습니다.';
      return result;
    }

    const count = await repository.updateLocationUseFlag(examroomCode, client);
    // 삭제된 데이터가 없는 경우
    if (!count) {
      result.message = '삭제 실패하였습니다.';
      return result;
    }
    //
    await client.query('COMMIT');
  } catch (err) {
    // 오류가 발생한다면 롤백
    console.error('트랜잭션 롤백', err);
    await client.query('ROLLBACK');
    throw err;
  } finally {
    // 커넥션 반납
    client.release();
  }
};

export default {
  findAllLocation,
  updateLocationUseFlag,
};
