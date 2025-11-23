import format from 'pg-format';
/**
 * 시험정보 목록 개수 조회
 * @param {object} params - 검색조건
 * @returns {string}      - 결과
 */
function buildExamInfoCount(params) {
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
function buildExamInfoList(params) {
  let sql = `
    SELECT 
        exam_code
      , exam_name
      , TO_CHAR(rgst_dt, 'YYYY-MM-DD') AS rgst_dt 
      , rgst_id
      , ROW_NUMBER() OVER(ORDER BY exam_code DESC) AS row_num
    FROM tb_exam_info
    WHERE use_flag = 'Y'
  `;

  sql += applyWhereFilter(params);

  sql += format(
    `
    ORDER BY exam_code DESC
    OFFSET %s::INTEGER LIMIT %s::INTEGER
    `,
    params.offset,
    params.limit,
  );

  return sql;
}
/**
 * 시험정보 목록 검색조건 추가
 * @param {object} params - 검색조건
 * @returns {string}      - 쿼리
 */
function applyWhereFilter(params) {
  let sql = '';
  if (params.examName) sql += format('AND exam_name ILIKE %L', `%${params.examName}%`);
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
 * 시험정보 사용유무 변경
 * @param {number} examCode - 시험정보pk
 * @returns {string}        - 쿼리
 */
function buildDeleteExamInfo(examCode) {
  return format(
    `
      UPDATE tb_exam_info SET
          use_flag = 'N'
        , updt_dt  = CURRENT_TIMESTAMP
      WHERE exam_code = %s::INTEGER
    `,
    examCode,
  );
}
/**
 * 시험정보 둥록
 * @param {object} params - 시험정보
 * @returns {string}        - 쿼리
 */
function buildInsertExamInfo(params) {
  return format(
    `
      INSERT INTO tb_exam_info ( 
          exam_name 
        , rgst_dt 
      ) VALUES ( 
          %L
        , CURRENT_TIMESTAMP
      ) RETURNING exam_code
    `,
    params.examName,
  );
}
/**
 * 시험정보 수정
 * @param {object} params - 시험정보
 * @returns {string}        - 쿼리
 */
function buildUpdateExamInfo(params) {
  return format(
    `
      UPDATE tb_exam_info SET 
          exam_name   = %L
        , updt_dt     = CURRENT_TIMESTAMP
      WHERE exam_code = %s
      RETURNING exam_code
    `,
    params.examName,
    params.examCode,
  );
}
/**
 * 시험상세정보 둥록
 * @param {object} params - 시험상세정보
 * @returns {string}      - 쿼리
 */
function buildInsertExamFormInfo(params) {
  return format(
    `
      INSERT INTO tb_exam_form_info ( 
          exam_code
        , exam_form_name 
        , exam_order 
        , exam_method 
        , exam_total_time 
        , personal_info_message 
        , personal_info_use_flag 
        , rgst_dt 
      ) VALUES ( 
          %s
        , %L
        , %s
        , %L
        , %s
        , %L
        , %L
        , CURRENT_TIMESTAMP
      )
    `,
    params.examCode,
    params.formName,
    params.examOrder,
    params.method,
    params.totalTime,
    params.personalInfoMessage,
    params.personalInfoUseFlag,
  );
}
/**
 * 시험상세정보 수정
 * @param {object} params - 시험상세정보 수정
 * @returns {string}      - 쿼리
 */
function buildUpdateExamFormInfo(params) {
  return format(
    `
      UPDATE tb_exam_form_info SET
          exam_form_name         = %L
        , exam_order 			       = %s
        , exam_method 			     = %L
        , exam_total_time 		   = %s
        , personal_info_message  = %L
        , personal_info_use_flag = %L
        , use_flag               = %L
        , updt_dt   		         = CURRENT_TIMESTAMP
      WHERE exam_form_code       = %s
    `,
    params.formName,
    params.examOrder,
    params.method,
    params.totalTime,
    params.personalInfoMessage,
    params.personalInfoUseFlag,
    params.useFlag,
    params.examFormCode,
  );
}
/**
 * 시험정보 상세 조회
 * @param {examCode} examCode - 시험정보pk
 * @returns {string}      - 쿼리
 */
function buildFindExamInfo(examCode) {
  return format(
    `
    SELECT 
        tei.exam_code 
      , tei.exam_name 
      , tei.use_flag 
      , JSONB_AGG(
          JSONB_BUILD_OBJECT(
              'examFormCode', tefi.exam_form_code 
            , 'examCode'	  , tefi.exam_code 
            , 'formName'	  , tefi.exam_form_name 
            , 'method'	    , tefi.exam_method 
            , 'totalTime'	  , tefi.exam_total_time 
            , 'personalInfoUseFlag', tefi.personal_info_use_flag 
            , 'personalInfoMessage', COALESCE(tefi.personal_info_message, '')
            , 'useFlag'	    , tefi.use_flag 
          ) ORDER BY tefi.exam_order 
        ) 					        AS details
    FROM tb_exam_info tei 
    JOIN tb_exam_form_info tefi 
      ON tefi.exam_code     = tei.exam_code 
        AND tefi.use_flag   = 'Y'
    WHERE tei.exam_code  	  = %s
      AND tei.use_flag 	    = 'Y'
    GROUP BY tei.exam_code, tei.exam_name, tei.use_flag 
    `,
    examCode,
  );
}

export default {
  buildExamInfoList,
  buildExamInfoCount,
  buildDeleteExamInfo,
  buildInsertExamInfo,
  buildUpdateExamInfo,
  buildInsertExamFormInfo,
  buildUpdateExamFormInfo,
  buildFindExamInfo,
};
