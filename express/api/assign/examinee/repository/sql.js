import format from 'pg-format';

/**
 * 응시자 목록 개수 조회
 * @param {object} params - 검색조건
 * @returns {string}      - 결과
 */
function buildExamineeCount(params) {
  let sql = `
    SELECT COUNT(*)
    FROM tb_examinee_info
    WHERE use_flag = 'Y'
  `;
  sql += applyWhereFilter(params);
  return sql;
}
/**
 * 응시자 목록 조회
 * @param {object} params - 검색조건
 * @returns {string}      - 결과
 */
function buildExamineeList(params) {
  let sql = `
    SELECT 
        examinee_code
      , examinee_id 
      , CASE WHEN examinee_gender = '1'
        THEN '남자' ELSE '여자'
        END 	   AS examinee_gender
      , examinee_name
      , examinee_name_en
      , examinee_college
      , examinee_major
      , examinee_phone
    , COALESCE(
      TO_CHAR(updt_dt, 'YYYY-MM-DD HH24:mi'), ''
      ) 	       AS updt_dt
  FROM tb_examinee_info
  WHERE use_flag = 'Y'
  `;
  sql += applyWhereFilter(params);
  sql += 'ORDER BY examinee_code DESC';
  return sql;
}
/**
 * 응시자 목록 검색조건 추가
 * @param {object} params - 검색조건
 * @returns {string}      - 쿼리
 */
function applyWhereFilter(params) {
  let sql = '';

  if (params.id)
    // 응시번호
    sql += format('AND examinee_id ILIKE %L', `%${params.id}%`);
  if (params.gender)
    // 성별
    sql += format('AND examinee_gender = %L', `${params.gender}`);
  if (params.name)
    // 이름
    sql += format('AND examinee_name ILIKE %L', `%${params.name}%`);
  if (params.college)
    // 대학
    sql += format('AND examinee_college ILIKE %L', `%${params.college}%`);
  if (params.major)
    // 학과
    sql += format('AND examinee_major ILIKE %L', `%${params.major}%`);
  if (params.rgstId) sql += format('AND reg_id ILIKE %L', `%${params.rgstId}%`);
  if (params.regStDt && params.regEnDt)
    sql += format(
      'AND rgst_dt BETWEEN %L::TIMESTAMP AND %L::TIMESTAMP',
      params.regStDt,
      params.regEnDt,
    );
  else if (params.regStDt) sql += format(`AND rgst_dt >= %L`, params.regStDt);

  return sql;
}
/**
 * 응시자 사용여부 변경
 * @param {examineeCode} params - 응시자pk
 * @returns {string}      - 쿼리
 */
function buildUpdateExamineeUseFlag(examineeCode) {
  return format(
    `
      UPDATE tb_examinee_info SET
        use_flag = 'N'
      , updt_dt  = CURRENT_TIMESTAMP
      WHERE examinee_code = %s::INTEGER
    `,
    examineeCode,
  );
}
/**
 * 중복된 응시번호 확인
 * @param {string} examineeId - 응시번호
 * @returns {string}          - 쿼리
 */
function buildExamineeIdDuplicatedCheck(examineeId) {
  return format(
    `
      SELECT COUNT(*)
      FROM tb_examinee_info
      WHERE examinee_id = %L
    `,
    examineeId,
  );
}
/**
 * 응시자 등록
 * @param {object} params - 응시자 정보
 * @returns {string}      - 쿼리
 */
function buildInsertExaminee(params) {
  return format(
    `
      INSERT INTO tb_examinee_info (
        examinee_id
      , examinee_pass
      , examinee_name
      , examinee_name_en
      , examinee_birth
      , examinee_gender
      , examinee_phone
      , examinee_email
      , examinee_college
      , examinee_major
      , examinee_img
      , rgst_dt
    ) VALUES ( 
        %L
      , %L
      , %L
      , %L
      , %L
      , %L
      , %L
      , %L
      , %L
      , %L
      , %L
      , CURRENT_TIMESTAMP
    )
    `,
    params.examineeId,
    params.examineePass,
    params.examineeName,
    params.examineeNameEn,
    params.examineeBirth,
    params.examineeGender,
    params.examineePhone,
    params.examineeEmail,
    params.examineeCollege,
    params.examineeMajor,
    params?.examineeImg || '',
  );
}

export default {
  buildExamineeCount,
  buildExamineeList,
  buildUpdateExamineeUseFlag,
  buildExamineeIdDuplicatedCheck,
  buildInsertExaminee,
};
