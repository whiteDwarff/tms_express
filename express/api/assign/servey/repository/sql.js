import format from 'pg-format';
/**
 * 설문 목록 개수 조회
 * @param {object} params - 검색조건
 * @returns {string}      - 결과
 */
function buildSurveyCount(params) {
  let sql = `
    SELECT COUNT(*)
    FROM tb_research_info tri
    WHERE use_flag = 'Y'
  `;
  sql += applyWhereFilter(params);

  return sql;
}
/**
 * 설문 목록 조회
 * @param {object} params - 검색조건
 * @returns {string}      - 결과
 */
function buildSurveyList(params) {
  let sql = `
    SELECT 
        tri.research_code 
      , tri.research_title 
      , tri.research_memo 
      , COUNT(trii.*)        AS item_count
      , TO_CHAR(tri.rgst_dt, 'YYYY-MM-DD HH24:MI') AS rgst_dt
      , ROW_NUMBER() OVER(ORDER BY tri.research_code DESC) AS row_num
    FROM tb_research_info tri
    JOIN tb_research_item_info trii 
      ON tri.research_code   = trii.research_code 
        AND trii.use_flag    = 'Y'
    WHERE tri.use_flag 		   = 'Y'
  `;

  sql += applyWhereFilter(params);

  sql += format(
    `
      GROUP BY 
        tri.research_code 
      , tri.research_title 
      , tri.research_memo 
      ORDER BY tri.research_code DESC
      OFFSET %s LIMIT %s
    `,
    params.offset,
    params.limit,
  );

  return sql;
}
/**
 * 목록 검색조건 추가
 * @param {object} params - 검색조건
 * @returns {string}      - 쿼리
 */
function applyWhereFilter(params) {
  let sql = '';

  if (params.researchTitle)
    sql += format('AND tri.research_title ILIKE %L', `%${params.researchTitle}%`);
  if (params.researchMemo)
    sql += format('AND tri.research_memo ILIKE %L', `%${params.researchMemo}%`);

  return sql;
}
/**
 * 설문 사용여부 변경
 * @param {array} researchCode - 설문pk 목록
 * @returns {string}           - 쿼리
 */
function buildUpdateResearchUseFlag(researchCode) {
  return format(
    `
      UPDATE tb_research_info SET
        use_flag = 'N'
      , updt_dt  = CURRENT_TIMESTAMP
      WHERE research_code IN (%s)
    `,
    researchCode.join(', '),
  );
}
/**
 * 설문 등록
 * @param {object} form - 설문정보
 * @returns {string}      - 결과
 */
function buildInsertSurvey(form) {
  return format(
    `
      INSERT INTO tb_research_info (
          research_title 
        , research_memo 
        , rgst_dt 
      ) VALUES (
          %L
        , %L
        , CURRENT_TIMESTAMP
      ) RETURNING research_code
      `,
    form.researchTitle,
    form.researchMemo,
  );
}
/**
 * 설문 수정
 * @param {object} form - 설문정보
 * @returns {string}      - 결과
 */
function buildUpdateServey(form) {
  return format(
    `
      UPDATE tb_research_info SET 
          research_title  = %L 
        , research_memo   = %L
        , updt_dt 	      = CURRENT_TIMESTAMP
      WHERE research_code = %s
      RETURNING research_code
    `,
    form.researchTitle,
    form.researchMemo,
    form.researchCode,
  );
}
/**
 * 설문 항목 등록
 * @param {object} form - 설문 항목 정보
 * @returns {string}    - 결과
 */
function buildInsertSurveyItem(form) {
  return format(
    `
      INSERT INTO tb_research_item_info ( 
          research_code 
        , re_item_no 
        , re_item_exam_no
        , re_item_title 
        , re_item_type
        , re_item_example
        , rgst_dt
      ) VALUES ( 
          %s 
        , %s
        , %s
        , %L
        , %L
        , %L
        , CURRENT_TIMESTAMP
      )
    `,
    form.researchCode,
    form.reItemNo,
    form.reItemNo,
    form.reItemTitle,
    form.reItemType,
    form.reItemExample,
  );
}
/**
 * 설문 항목 수정
 * @param {object} form - 설문 항목 정보
 * @returns {string}    - 결과
 */
function buildUpdateSurveyItem(form) {
  return format(
    `
      UPDATE tb_research_item_info SET
          re_item_no      = %s
        , re_item_exam_no = %s
        , re_item_title   = %L
        , re_item_type    = %L
        , re_item_example = %L
        , use_flag        = %L
        , updt_dt 	      = CURRENT_TIMESTAMP
      WHERE re_item_code  = %s
    `,
    form.reItemNo,
    form.reItemNo,
    form.reItemTitle,
    form.reItemType,
    form.reItemExample,
    form.useFlag,
    form.reItemCode,
  );
}
/**
 * 설문 상세 조회
 * @param {number} researchCode researchCode - 설문pk
 * @returns {string} - 결과
 */
function buildFindServey(researchCode) {
  return format(
    `
      SELECT 
          tri.research_code 
        , tri.research_title 
        , tri.research_memo 
        , JSONB_AGG(
            JSONB_BUILD_OBJECT(
                'reItemCode'   , trii.re_item_code 
              , 'researchCode' , trii.research_code  
              , 'reItemNo'     , trii.re_item_no 
              , 'reItemTitle'  , trii.re_item_title 
              , 'reItemType'   , trii.re_item_type 
              , 'reItemExample', string_to_array(trii.re_item_example, ',')
              , 'useFlag'		 , trii.use_flag 
            ) ORDER BY trii.re_item_no  ASC 
          ) 				           AS survey
      FROM tb_research_info tri
      JOIN tb_research_item_info trii 
        ON tri.research_code   = trii.research_code 
          AND trii.use_flag    = 'Y'
      WHERE trii.research_code = %s
      GROUP BY tri.research_code 
          , tri.research_title 
          , tri.research_memo 
    `,
    researchCode,
  );
}

export default {
  buildSurveyCount,
  buildSurveyList,
  buildUpdateResearchUseFlag,
  buildInsertSurvey,
  buildUpdateServey,
  buildInsertSurveyItem,
  buildUpdateSurveyItem,
  buildFindServey,
};
