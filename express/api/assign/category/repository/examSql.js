import format from 'pg-format';

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
                    'key' 	 , teci3.cate_code 
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
      ORDER BY teci.cate_code ASC 
    `,
  );
}

export default {
  buildFindExamCategoryList,
};
