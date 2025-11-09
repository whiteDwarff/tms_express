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
 * @param {Array} params - 파라미터 배열
 * @returns {Promise<Array>} 결과
 */
const query = async (sql, params = []) => {
  try {
    // 쿼리 실행
    const res = await pool.query(sql, params);
    // 조회 결과를 camelCase로 변환
    return convertKeysToCamelCase(res.rows);
  } catch (err) {
    console.error("DB 쿼리 실행 중 에러 발생", { sql, params, err });
    throw err;
  }
};

export default {
  query,
};
