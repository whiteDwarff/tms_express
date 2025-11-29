import pool from '#root/db/pool.js';
import { validNumber } from '#root/common/validate-rules.js';
import {
  ValidationError,
  NotFoundError,
  DatabaseError,
  serviceErrorHandler,
} from '#root/error/index.js';
import repository from '../repository/serveyRepository.js';

/**
 * 설문 목록과 총 개수 조회
 * @param {object} params - 검색조건
 * @returns               - 결과
 */
const findAll = async (params) => {
  try {
    const [{ rows: list }, count] = await Promise.all([
      repository.findAll(params),
      repository.findListCount(params),
    ]);
    return { list, count };
  } catch (err) {
    throw new serviceErrorHandler(err);
  }
};
/**
 * 설문 목록 사용여부 변경
 * @param {object} params - body
 * @returns               - 결과
 */
const updateUseFlag = async (params) => {
  // 커넥션풀에서 하나의 커넥션을 가져온다
  const client = await pool.connect();

  try {
    const researchCode = params?.researchCode || [];
    // 삭제할 데이터가 없는 경우
    if (!researchCode.length) throw new ValidationError('삭제할 항목이 없습니다.');

    const count = await repository.updateUseFlag(researchCode, client);
    // 삭제된 데이터가 없는 경우
    if (!count) throw new NotFoundError('삭제 실패하였습니다.');

    await client.query('COMMIT');
    return { count };
  } catch (err) {
    // 오류가 발생한다면 롤백
    await client.query('ROLLBACK');
    throw new serviceErrorHandler(err);
  } finally {
    // 커넥션 반납
    client.release();
  }
};
/**
 * 설문 등록 및 수정
 * @param {object} params - 설문 객체
 * @returns               - 결과
 */
const editSurvey = async (params) => {
  // 등록, 수정 여부 확인
  const hasResearchCode = params.researchCode != null;
  let researchCode = null;

  // 커넥션풀에서 하나의 커넥션을 가져온다
  const client = await pool.connect();
  try {
    // 트랜잭션 시작
    await client.query('BEGIN');

    // 시험장 저장 결과
    let servey = {};

    if (!hasResearchCode) {
      servey = await repository.insertSurvey(params, client);
    } else servey = await repository.updateSurvey(params, client);

    // 등록 및 수정 결과가 있다면 상세정보 처리
    if (servey.rowCount) {
      // pk 할당
      researchCode = servey.rows[0].researchCode;

      let reItemNo = 0;
      for (let item of params.survey) {
        // 삭제되지 않은 항목만 순서 재할당
        if (item.useFlag == 'Y') reItemNo++;
        item.reItemNo = reItemNo;
        // 보기
        item.reItemExample = item.reItemExample.map((example) => example.value.trim()).join(',');
        // 최초 등록
        if (!item.reItemCode) {
          // 순서
          item.researchCode = researchCode;
          // 설문항목
          await repository.insertSurveyItem(item, client);
          // 수정
        } else await repository.updateSurveyItem(item, client);
      }
      // try에서 오류가 나지 않는다면 커밋
      await client.query('COMMIT');
    } else throw new DatabaseError(`설문 ${!researchCode ? '등록' : '수정'} 실패하였습니다.`);

    return {
      count: servey.rowCount,
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

const findServey = async (researchCode) => {
  if (!researchCode || !validNumber(researchCode)) throw ValidationError('잘못된 접근 입니다.');

  const { rows } = await repository.findServey(researchCode);

  if (!rows.length) throw NotFoundError('설문을 찾을 수 없습니다.');
  return rows[0];
};

export default {
  findAll,
  updateUseFlag,
  editSurvey,
  findServey,
};
