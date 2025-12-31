import format from 'pg-format';

/**
 * 시험분류 목록 조회
 * @returns - 시험분류 목록
 */
function buildFindExamCategoryList() {
  return format(
    `
      SELECT 
          teci.cate_code 
        , teci.cate_name 			AS name
        , teci.cate_step 			AS depth
        , teci.use_flag 
        , teci.cate_code 		  AS KEY
        , teci.parent_code		AS root_key
        , teci.sub1_code			AS node_key
        , 'root'		  		    AS header
        , coalesce(teci2.children, '[]') AS children
      FROM tb_exam_cate_info teci
      LEFT JOIN (
        SELECT 
            teci2.parent_code
          , JSONB_AGG(
              JSONB_BUILD_OBJECT(
                  'key' 	   , teci2.cate_code 
                , 'cateCode' , teci2.cate_code 
                , 'name'     , teci2.cate_name 
                , 'depth'    , teci2.cate_step 
                , 'rootKey'  , teci2.parent_code
                , 'nodeKey'  , teci2.sub1_code
                , 'useFlag'  , teci2.use_flag 
                , 'header'   , 'node'
                , 'children' , COALESCE(teci3.children, '[]')
              )  ORDER BY teci2.cate_code ASC 
            )					           AS children	  
        FROM tb_exam_cate_info teci2
        LEFT JOIN ( 
          SELECT 
              teci3.sub1_code
            , JSONB_AGG(
                JSONB_BUILD_OBJECT(
                    'key' 	   , teci3.cate_code 
                  , 'cateCode' , teci3.cate_code 
                  , 'name'     , teci3.cate_name 
                  , 'depth'    , teci3.cate_step 
                  , 'rootKey'  , teci3.parent_code
                  , 'nodeKey'  , teci3.sub1_code
                  , 'useFlag'  , teci3.use_flag 
                  , 'header'   , 'item'
                )  ORDER BY teci3.cate_code ASC 
              ) 				         AS children	  
          FROM tb_exam_cate_info teci3
          WHERE teci3.cate_step  = 3
            AND teci3.use_flag   = 'Y'
            AND teci3.parent_code IS NOT NULL 
            AND teci3.sub1_code IS NOT NULL 
          GROUP BY teci3.sub1_code
        ) teci3 
          ON teci3.sub1_code 	   = teci2.cate_code
        WHERE teci2.cate_step  	 = 2
          AND teci2.use_flag 	   = 'Y'
          AND teci2.parent_code IS NOT NULL 
        GROUP BY teci2.parent_code
        ORDER BY teci2.parent_code
      ) teci2
        ON teci2.parent_code = teci.cate_code
      WHERE teci.cate_step  		 = 1
        AND teci.use_flag 		   = 'Y'
      ORDER BY teci.cate_code DESC 
    `,
  );
}
/**
 * 시험분류 등록
 * @param {object} form - 시험분류 정보
 * @returns {any}       - 시험분류pk
 */
function buildInsertExamCategory(form) {
  return format(
    `
      INSERT INTO tb_exam_cate_info (
          cate_name 
        , parent_code 
        , sub1_code 
        , cate_step 
      ) VALUES (
          %L
        , %L
        , %L 
        , %s
      ) RETURNING cate_code
    `,
    form.name,
    form?.rootKey || null,
    form?.nodeKey || null,
    form.depth,
  );
}
/**
 * 시험분류 수정
 * @param {object} form - 시험분류 정보
 * @returns {any}       - 시험분류pk
 */
function buildUpdateExamCategory(form) {
  return format(
    `
      UPDATE tb_exam_cate_info SET 
          cate_name   = %L
        , use_flag    = %L
        , updt_dt     = CURRENT_TIMESTAMP 
      WHERE cate_code = %s
      RETURNING cate_code
    `,
    form.name,
    form.useFlag,
    form.cateCode,
  );
}

export default {
  buildFindExamCategoryList,
  buildInsertExamCategory,
  buildUpdateExamCategory
};
