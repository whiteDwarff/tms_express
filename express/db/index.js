import pool from "./pool.js";
import lodashCamelCase from "lodash/camelCase.js";

const convertKeysToCamelCase = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(convertKeysToCamelCase);
  } else if (
    obj !== null &&
    typeof obj === "object" &&
    !(obj instanceof Date)
  ) {
    return Object.keys(obj).reduce((acc, key) => {
      const newKey = lodashCamelCase(key);
      acc[newKey] = convertKeysToCamelCase(obj[key]);
      return acc;
    }, {});
  }
  return obj;
};

/**
 * DB 쿼리를 실행하고, 결과를 camelCase로 변환하여 반환
 * @param {string} sql - SQL 쿼리
 * @param {object} client - DB 클라이언트 
 * @returns {Promise<Array>} 결과
 */
const query = async (sql, client = null) => {
  try {
    console.log(`${ sql };`);

    // 트랜잭션 객체 유무에 따라 다르게 실행
    const { rows, rowCount } = client ? 
      await client.query(sql) : await pool.query(sql);

    return {
      rows: convertKeysToCamelCase(rows) || [],
      rowCount: rowCount || 0
    };
  } catch (err) {
    console.error('query error', { sql, err });
    throw err;
  }
};
/**
 * UPDATE, DELETE, INSERT 개수 반환
 * @param {string} sql - SQL 쿼리
 * @param {Array} params - 파라미터
 * @returns {Promise<Array>} 결과
 */
const execute = async (sql) => {
  try {
    console.log(`${ sql };`);
    const res = await pool.query(sql);
    // 쿼리 실행 결과 rowCount 반환
    return res?.rowCount || 0; 
  } catch (err) {
    console.error('execute error', { sql, err });
    throw err;
  }
};

export default {
  query,
  execute,
};
