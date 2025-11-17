import repository from '../repository/examineeRepository.js';
import pool from '../../../../db/pool.js';

/**
 * 응시자 목록과 총 개수 조회
 * @param {object} params - 검색조건
 * @returns - 결과
 */
const findAllExamineeInfo = async (params) => {
  const [{ rows: list }, count] = await Promise.all([
    repository.findAllExamineeInfo(params),
    repository.findAllExamineeCount(params),
  ]);
  return { list, count };
};
/**
 * 응시자 목록 사용여부 변경
 * @param {object} params - 응시자pk
 * @returns - 결과
 */
const updateExamineeUseFlag = async (params) => {
  const result = {};
  // 커넥션풀에서 하나의 커넥션을 가져온다
  const client = await pool.connect();

  try {
    const examineeCode = params.examineeCode;
    if(!examineeCode.length) {
      result.message = '삭제 실패하였습니다.';
      return result;
    }

    for(let code of examineeCode) {
      await repository.updatExamineeUseFlag(code, client);
    }
    await client.query('COMMIT');
  } catch(err) {
    // 오류가 발생한다면 롤백
    await client.query('ROLLBACK');
    console.error('트랜잭션 롤백', err);
    throw err;
  } finally {
    // 커넥션 반납
    client.release();
  }

  console.log(params)
}

export default {
  findAllExamineeInfo,
  updateExamineeUseFlag
};
