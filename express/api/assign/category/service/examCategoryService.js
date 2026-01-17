import pool from '#root/db/pool.js';
import {
  NotFoundError,
  DatabaseError,
  serviceErrorHandler,
} from '#root/error/index.js';
import repository from '../repository/examCategoryRepository.js';

/**
 * 시험분류 목록 조회
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
/**
 * 시험분류 목록 등록 및 수정
 * @param {object} params - 시험분류
 * @returns               - 결과
 */
const editExamCategory = async (params) => {
  const client = await pool.connect();
  
  try {
    if (!params ||!params.length) throw new NotFoundError('저장할 데이터가 없습니다.');

    for (let root of params) {
      // cateCode가 있다면 수정, 없다면 등록
      const rootKey = !hasCateCode(root) ? 
        await repository.insertExamCategory(root, client) : await repository.updateExamCategory(root, client);

      // 1depth 등록 및 수정 성공
      if (rootKey.rowCount) {
        let nodeKey = null;
        for (let node of root.children) {
          // 2depth 등록 및 수정
          if (!hasCateCode(node)) {
            // 2depth 등록
            node.rootKey = rootKey.rows[0].cateCode;
            nodeKey = await repository.insertExamCategory(node, client);
          // 2depth 수정
          } else nodeKey = await repository.updateExamCategory(node, client);
          
          // 2depth 등록 및 수정 성공
          if (nodeKey.rowCount) {
            for (let item of node.children) {
              if (!hasCateCode(item)) {
                // 3depth 등록
                item.rootKey = node.rootKey;
                item.nodeKey = nodeKey.rows[0].cateCode;
                await repository.insertExamCategory(item, client);
                // 3depth 수정
              } else await repository.updateExamCategory(item, client);
            }
          // 2depth 실패
          } else throw new DatabaseError('시험분류 저장 실패하였습니다.');
        }
      // 1depth 실패
      } else throw new DatabaseError('시험분류 저장 실패하였습니다.');
    }
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw serviceErrorHandler(err);
  } finally {
    client.release();
  }
};
/**
 * 분류별 시험 목록 조회
 * @param {object} params - 검색조건
 * @returns               - 결과
 */
const findByDepth = async (params) => {
  try {
    const result = await repository.findExamCategoryByDepth(params);
    return { list: result.rows };
  } catch (err) {
    throw serviceErrorHandler(err);
  }
};


// cateCode가 유무 확인
const hasCateCode = (item) => !!item.cateCode;

export default {
  findAll,
  editExamCategory,
  findByDepth
};
