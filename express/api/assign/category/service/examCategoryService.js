import pool from '#root/db/pool.js';
import { validNumber } from '#root/common/validate-rules.js';
import {
  ValidationError,
  NotFoundError,
  DatabaseError,
  serviceErrorHandler,
} from '#root/error/index.js';
import repository from '../repository/examCategoryRepository.js';

/**
 * 시험분류 목록과 총 개수 조회
 * @param {object} params - 검색조건
 * @returns               - 결과
 */
const findAll = async (params) => {
  try {
    const result = await repository.findAll(params);
    return { list: result.rows };
  } catch (err) {
    throw serviceErrorHandler(err);
  }
};

export default {
  findAll,
};
