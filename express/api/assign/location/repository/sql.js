import format from 'pg-format';

/**
 * 시험장 목록 개수 조회
 * @param {object} params - 검색조건
 * @returns {string}      - 결과
 */
function buildLocationCount(params) {
  let sql = `
    SELECT COUNT(*)
    FROM tb_examroom_info  
    WHERE use_flag = 'Y'
  `;
  sql += applyWhereFilter(params);
  return sql;
}
/**
 * 시험장 목록 조회
 * @param {object} params - 검색조건
 * @returns {string}      - 결과
 */
function buildLocationList(params) {
  let sql = `
    SELECT 
        examroom_code 
      , examroom_name 
      , examroom_location 
      , examroom_addr 
    FROM tb_examroom_info  
    WHERE use_flag = 'Y'
  `;

  sql += applyWhereFilter(params);

  sql += format(
    `
      ORDER BY examroom_code DESC
      OFFSET %s LIMIT %s
    `,
    params.offset,
    params.limit,
  );
  return sql;
}
/**
 * 시험장 목록 검색조건 추가
 * @param {object} params - 검색조건
 * @returns {string}      - 쿼리
 */
function applyWhereFilter(params) {
  let sql = '';
  // 시험장
  if (params.roomName) sql += format('AND examroom_name ILIKE %L', `%${params.roomName}%`);
  // 시험장소
  if (params.location) sql += format('AND examroom_location ILIKE %L', `%${params.location}%`);
  return sql;
}
/**
 * 시험장 사용여부 변경
 * @param {array} examroomCode - 시험장pk
 * @returns {string}           - 쿼리
 */
function buildUpdateLocationUseFlag(examroomCode) {
  return format(
    `
      UPDATE tb_examroom_info SET
        use_flag = 'N'
      , updt_dt  = CURRENT_TIMESTAMP
      WHERE examroom_code IN (%s)
    `,
    examroomCode.join(', '),
  );
}

export default {
  buildLocationCount,
  buildLocationList,
  buildUpdateLocationUseFlag,
};
