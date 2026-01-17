import format from 'pg-format';

/**
 * 교과목분류 목록 조회
 * @returns - 교과목분류 목록
 */
function buildFindSubjectCategoryList() {
  return format(
    `
    SELECT 
          tsci.subject_cate_code 	AS cate_code
        , tsci.subject_cate_name 	AS name
        , tsci.cate_step 			AS depth
        , tsci.use_flag 
        , tsci.subject_cate_code 	AS KEY
        , tsci.parent_code			AS root_key
        , tsci.sub1_code			AS node_key
        , 'root'		  		    AS header
        , coalesce(teci2.children, '[]') AS children
    FROM tb_subject_cate_info tsci
      LEFT JOIN (
          SELECT 
              tsci2.parent_code
            , JSONB_AGG(
                JSONB_BUILD_OBJECT(
                    'key' 	 , tsci2.subject_cate_code 
              , 'cateCode' , tsci2.subject_cate_code 
              , 'name'     , tsci2.subject_cate_name 
              , 'depth'    , tsci2.cate_step 
              , 'rootKey'  , tsci2.parent_code
              , 'nodeKey'  , tsci2.sub1_code
              , 'useFlag'  , tsci2.use_flag 
              , 'header'   , 'node'
              , 'children' , COALESCE(teci3.children, '[]')
            )  ORDER BY tsci2.subject_cate_code ASC 
      )					           AS children	  
      FROM tb_subject_cate_info tsci2
      LEFT JOIN ( 
        SELECT 
            tsci3.sub1_code
          , JSONB_AGG(
              JSONB_BUILD_OBJECT(
                  'key' 	   , tsci3.subject_cate_code 
                , 'cateCode' , tsci3.subject_cate_code 
                , 'name'     , tsci3.subject_cate_name 
                , 'depth'    , tsci3.cate_step 
                , 'rootKey'  , tsci3.parent_code
                , 'nodeKey'  , tsci3.sub1_code
                , 'useFlag'  , tsci3.use_flag 
                , 'header'   , 'item'
              )  ORDER BY tsci3.subject_cate_code ASC 
            ) 				    AS children	  
        FROM tb_subject_cate_info tsci3
        WHERE tsci3.cate_step  	= 3
          AND tsci3.use_flag   	= 'Y'
          AND tsci3.parent_code IS NOT NULL 
          AND tsci3.sub1_code IS NOT NULL 
        GROUP BY tsci3.sub1_code
      ) teci3 
        ON teci3.sub1_code 	   	= tsci2.subject_cate_code
      WHERE tsci2.cate_step  	 	= 2
        AND tsci2.use_flag 	   	= 'Y'
            AND tsci2.parent_code IS NOT NULL 
          GROUP BY tsci2.parent_code
          ORDER BY tsci2.parent_code
      ) teci2
        ON teci2.parent_code 		= tsci.subject_cate_code
    WHERE tsci.cate_step  		 	= 1
        AND tsci.use_flag 		 	= 'Y'
    ORDER BY tsci.subject_cate_code DESC 
    `,
  );
}

/**
 * 교과목분류 등록
 * @param {object} form - 교과목분류 정보
 * @returns {any}       - 교과목분류pk
 */
function buildInsertSubjectCategory(form) {
  return format(
    `
      INSERT INTO tb_subject_cate_info (
          subject_cate_name 
        , parent_code 
        , sub1_code 
        , cate_step 
      ) VALUES (
          %L
        , %L
        , %L 
        , %s
      ) RETURNING subject_cate_code AS cate_code
    `,
    form.name,
    form?.rootKey || null,
    form?.nodeKey || null,
    form.depth,
  );
}
/**
 * 교과목분류 수정
 * @param {object} form - 교과목분류 정보
 * @returns {any}       - 교과목분류pk
 */
function buildUpdateSubjectCategory(form) {
  return format(
    `
      UPDATE tb_subject_cate_info SET 
          subject_cate_name   = %L
        , use_flag            = %L
        , updt_dt             = CURRENT_TIMESTAMP 
      WHERE subject_cate_code = %s
      RETURNING subject_cate_code AS cate_code
    `,
    form.name,
    form.useFlag,
    form.cateCode,
  );
}
/**
 * 분류별 교과목 목록 조회
 * @param {object} form - 교과목분류 정보
 * @returns {array}       - 교과목분류 목록
 */
function buildFindSubjectCategoryByDepth(form) {
  let sql = `
    SELECT 
        subject_cate_code AS value
      , subject_cate_name AS label
    FROM tb_subject_cate_info
    WHERE use_flag   		  = 'Y'
      AND cate_step 		  = %s
`;
  // 2depth
  if (form.subjectCate1) sql += ' AND parent_code = %s';
  // 3depth
  if (form.subjectCate2) sql += ' AND sub1_code = %s';

  sql += ' ORDER BY subject_cate_code ASC';

  return format(sql, form.cateStep, form.subjectCate1, form.subjectCate2);
}

export default {
  buildFindSubjectCategoryList,
  buildInsertSubjectCategory,
  buildUpdateSubjectCategory,
  buildFindSubjectCategoryByDepth
};
