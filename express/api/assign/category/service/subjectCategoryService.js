import pool from '#root/db/pool.js';
import {
  NotFoundError,
  DatabaseError,
  serviceErrorHandler,
} from '#root/error/index.js';
import repository from '../repository/subjectCategoryRepository.js';

/**
 * 교과목분류 목록 조회
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
 * 교과목분류 목록 등록 및 수정
 * @param {object} params - 교과목분류
 * @returns               - 결과
 */
const editSubjectCategory = async (params) => {
  const client = await pool.connect();
  
  try {
    if (!params ||!params.length) throw new NotFoundError('저장할 데이터가 없습니다.');

    for (let root of params) {
      // cateCode가 있다면 수정, 없다면 등록
      const rootKey = !hasCateCode(root) ? 
        await repository.insertSubjectCategory(root, client) : await repository.updateSubjectCategory(root, client);

      // 1depth 등록 및 수정 성공
      if (rootKey.rowCount) {
        let nodeKey = null;
        for (let node of root.children) {
          // 2depth 등록 및 수정
          if (!hasCateCode(node)) {
            // 2depth 등록
            node.rootKey = rootKey.rows[0].cateCode;
            nodeKey = await repository.insertSubjectCategory(node, client);
          // 2depth 수정
          } else nodeKey = await repository.updateSubjectCategory(node, client);
          
          // 2depth 등록 및 수정 성공
          if (nodeKey.rowCount) {
            for (let item of node.children) {
              if (!hasCateCode(item)) {
                // 3depth 등록
                item.rootKey = node.rootKey;
                item.nodeKey = nodeKey.rows[0].cateCode;
                await repository.insertSubjectCategory(item, client);
                // 3depth 수정
              } else await repository.updateSubjectCategory(item, client);
            }
          // 2depth 실패
          } else throw new DatabaseError('교과목분류 저장 실패하였습니다.');
        }
      // 1depth 실패
      } else throw new DatabaseError('교과목분류 저장 실패하였습니다.');
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
 * 분류별 교과목 목록 조회
 * @param {object} params - 검색조건
 * @returns               - 결과
 */
const findByDepth = async (params) => {
  try {
    const result = await repository.findSubjectCategoryByDepth(params);
    return { list: result.rows };
  } catch (err) {
    throw serviceErrorHandler(err);
  }
};

// cateCode가 유무 확인
const hasCateCode = (item) => !!item.cateCode;

export default {
  findAll,
  editSubjectCategory,
  findByDepth
};
