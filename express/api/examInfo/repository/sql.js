import format from "pg-format";
/**
 * 시험정보 목록 개수 조회
 * @param {object} params - 검색조건
 * @returns {string}      - 결과
 */
export function buildExamInfoCountQuery(params) {
  let sql = `
    SELECT COUNT(*)
    FROM tb_exam_info
    WHERE use_flag = 'Y'
  `;
  sql += applyWhereFilter(params);

  return sql;
}
/**
 * 시험정보 목록 조회
 * @param {object} params - 검색조건
 * @returns {string}      - 결과
 */
export function buildExamInfoListQuery(params) {
  let sql = `
    SELECT 
        exam_code
      , exam_name
      , TO_CHAR(rgst_dt, 'YYYY-MM-DD') AS rgst_dt 
      , rgst_id
    FROM tb_exam_info
    WHERE use_flag = 'Y'
  `;

  sql += applyWhereFilter(params);

  sql += format(
    `
    ORDER BY exam_code ASC
    OFFSET %s::INTEGER LIMIT %s::INTEGER
    `,
    params.offset,
    params.limit
  );

  return sql;
}
/**
 * 시험정보 목록 검색조건 추가
 * @param {object} params - 검색조건
 * @returns {string}      - 쿼리
 */
function applyWhereFilter(params) {
  let sql = "";
  if (params.examName)
    sql += format("AND exam_name ILIKE %L", `%${params.examName}%`);
  if (params.rgstId) sql += format("AND reg_id ILIKE %L", `%${params.rgstId}%`);
  if (params.regStDt && params.regEnDt)
    sql += format(
      "AND rgst_dt BETWEEN %L::TIMESTAMP AND %L::TIMESTAMP",
      params.regStDt,
      params.regEnDt
    );
  else if (params.regStDt) sql += format(`AND rgst_dt >= %L`, params.regStDt);

  return sql;
}
/**
 * 시험정보 목록 조회
 * @param {number} examCode - 시험정보pk
 * @returns {string}        - 쿼리
 */
export function buildDeleteExamInfoQuery(examCode) {
  return format(
    `
      UPDATE tb_exam_info SET
        use_flag = 'N'
      WHERE exam_code = %s::INTEGER
    `,
    examCode
  );
}
