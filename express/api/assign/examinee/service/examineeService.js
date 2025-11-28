import pool from '#root/db/pool.js';
import { validNumber } from '#root/common/validate-rules.js';
import {
  ValidationError,
  NotFoundError,
  DatabaseError,
  serviceErrorHandler,
} from '#root/error/index.js';

import fileService from '#root/api/file/service/fileService.js';
import repository from '../repository/examineeRepository.js';

/**
 * 응시자 목록과 총 개수 조회
 * @param {object} params - 검색조건
 * @returns - 결과
 */
const findAllExamineeInfo = async (params) => {
  try {
    const [{ rows: list }, count] = await Promise.all([
      repository.findAllExamineeInfo(params),
      repository.findAllExamineeCount(params),
    ]);
    return { list, count };
  } catch (err) {
    throw serviceErrorHandler(err);
  }
};
/**
 * 응시자 목록 사용여부 변경
 * @param {object} params - 응시자pk
 * @returns - 결과
 */
const updateExamineeUseFlag = async (params) => {
  // 커넥션풀에서 하나의 커넥션을 가져온다
  const client = await pool.connect();

  try {
    const examineeCode = params.examineeCode;
    if (!examineeCode.length) throw new ValidationError('삭제할 항목이 없습니다.');

    for (let code of examineeCode) await repository.updateExamineeUseFlag(code, client);

    await client.query('COMMIT');
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
 * 응시자 등록 및 수정
 * @param {object} params - 응시자 정보
 * @param {file}   file   - 프로필 이미지
 * @returns - 결과
 */
const examineeEdit = async (params, file) => {
  params = JSON.parse(params.data);
  const hasCode = params.examineeCode != null;

  // 등록인 경우 중복된 응시번호 체크
  if (!hasCode) {
    const count = await repository.examineeIdDuplicatedCheck(params.examineeId);
    if (count > 0) throw new DuplicatedError('중복된 응시번호가 존재합니다.');
  }

  // 파일이 있다면 저장
  if (file) {
    const { fullPath } = await fileService.saveFileFromMemory(file, 'profile');
    params.examineeImg = fullPath;
  } else params.examineeImg = params.examineeImg || '';

  // 등록 및 수정
  const count = !hasCode
    ? await repository.insertExaminee(params)
    : await repository.updateExaminee(params);

  if (!count) throw new DatabaseError('저장 실패하였습니다.');

  return { count };
};
/**
 * 응시자 상세조회
 * @param {object} params - 응시자 정보
 * @returns - 결과
 */
const findExaminee = async (examineeCode) => {
  if (!examineeCode || !validNumber(examineeCode)) throw ValidationError('잘못된 접근 입니다.');

  const { rows } = await repository.findExaminee(examineeCode);

  if (!rows.length) throw NotFoundError('응시자를 찾을 수 없습니다.');
  return rows[0];
};

export default {
  findAllExamineeInfo,
  updateExamineeUseFlag,
  examineeEdit,
  findExaminee,
};
