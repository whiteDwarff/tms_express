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
      , ROW_NUMBER() over(ORDER BY examroom_code DESC) AS row_num
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
/**
 * 시험장 등록
 * @param {object} form - 시험장 정보
 * @returns {string}    - 쿼리
 */
function buildInsertExamRoom(form) {
  return format(
    `
      INSERT INTO tb_examroom_info (
          examroom_name
        , examroom_location
        , examroom_addr
        , examroom_info
        , examroom_charge
        , examroom_phone
        , examroom_charge_info
        , rgst_dt
      ) VALUES ( 
          %L
        , %L
        , %L
        , %L
        , %L
        , %L
        , %L
        , CURRENT_TIMESTAMP
      ) RETURNING examroom_code
    `,
    form.examroomName,
    form.examroomLocation,
    form.examroomAddr,
    form.examroomInfo,
    form.examroomCharge,
    form.examroomPhone,
    form.examroomChargeInfo,
  );
}
/**
 * 시험장 수정
 * @param {object} form - 시험장 정보
 * @returns {string}    - 쿼리
 */
function buildUpdateExamRoom(form) {
  return format(
    `
      UPDATE tb_examroom_info SET 
          examroom_name        = %L
        , examroom_location    = %L
        , examroom_addr        = %L
        , examroom_info        = %L
        , examroom_charge      = %L
        , examroom_phone       = %L
        , examroom_charge_info = %L
        , updt_dt              = CURRENT_TIMESTAMP
      WHERE examroom_code      = %s
      RETURNING examroom_code
    `,
    form.examroomName,
    form.examroomLocation,
    form.examroomAddr,
    form.examroomInfo,
    form.examroomCharge,
    form.examroomPhone,
    form.examroomChargeInfo,
    form.examroomCode,
  );
}
/**
 * 호실 등록
 * @param {object} form - 호실 정보
 * @returns {string}    - 쿼리
 */
function buildInsertExamRoomNum(form) {
  return format(
    `
      INSERT INTO tb_examroom_num_info (
          examroom_code
        , examroom_num_name
        , examroom_num_max
        , examroom_num_row
        , examroom_num_col
        , examroom_num_info
        , rgst_dt
      ) VALUES ( 
          %s 
        , %L
        , %s
        , %s
        , %s
        , %L
        , CURRENT_TIMESTAMP
      )
    `,
    form.examroomCode,
    form.examroomNumNameOri,
    form.examroomNumColOri + form.examroomNumRowOri,
    form.examroomNumColOri,
    form.examroomNumRowOri,
    form.examroomNumInfo,
  );
}
/**
 * 호실 수정
 * @param {object} form - 호실 정보
 * @returns {string}    - 쿼리
 */
function buildUpdateExamRoomNum(form) {
  return format(
    `
      UPDATE tb_examroom_num_info SET 
          examroom_num_name   = %L
        , examroom_num_max    = %s
        , examroom_num_row    = %s
        , examroom_num_col    = %s
        , examroom_num_info   = %L
        , use_flag            = %L
        , updt_dt             = CURRENT_TIMESTAMP
      WHERE examroom_num_code = %s
    `,
    form.examroomNumNameOri,
    form.examroomNumColOri + form.examroomNumRowOri,
    form.examroomNumColOri,
    form.examroomNumRowOri,
    form.examroomNumInfo,
    form.useFlag,
    form.examroomNumCode,
  );
}
/**
 * 시험장 상세 조회
 * @param {number} excmroomCode - 시험장pk
 * @returns                     - 결과
 */
function buildFindLocation(excmroomCode) {
  return format(
    `
    SELECT 
      tei.examroom_code
      , tei.examroom_name
      , tei.examroom_location
      , tei.examroom_addr
      , tei.examroom_info
      , tei.examroom_charge
      , tei.examroom_phone
      , tei.examroom_charge_info
      , COALESCE(
        JSONB_AGG(
            JSONB_BUILD_OBJECT(
                'examroomCode'   	  , teni.examroom_code
              , 'key'			   	      , teni.examroom_num_code
              , 'examroomNumCode'	  , teni.examroom_num_code
              , 'examroomNumName'	  , teni.examroom_num_name
              , 'examroomNumMax' 	  , teni.examroom_num_max
              , 'examroomNumRow' 	  , teni.examroom_num_row
              , 'examroomNumCol' 	  , teni.examroom_num_row
              , 'examroomNumInfo'	  , teni.examroom_num_info
              , 'useFlag'		   	    , teni.use_flag
              , 'examroomNumNameOri', teni.examroom_num_name
              , 'examroomNumRowOri' , teni.examroom_num_row
              , 'examroomNumColOri' , teni.examroom_num_row
            ) ORDER BY teni.rgst_dt ASC
        ), 
      '[]')				          AS room_num_info
    FROM tb_examroom_info tei
    JOIN tb_examroom_num_info teni
      ON tei.examroom_code  = teni.examroom_code 
        AND teni.use_flag   = 'Y'
    WHERE tei.examroom_code = %s
      AND tei.use_flag      = 'Y'
    GROUP BY tei.examroom_code
      , tei.examroom_name
      , tei.examroom_location
      , tei.examroom_addr
      , tei.examroom_info
      , tei.examroom_charge
      , tei.examroom_phone
      , tei.examroom_charge_info
    `,
    excmroomCode,
  );
}

export default {
  buildLocationCount,
  buildLocationList,
  buildUpdateLocationUseFlag,
  buildInsertExamRoom,
  buildInsertExamRoomNum,
  buildUpdateExamRoom,
  buildUpdateExamRoomNum,
  buildFindLocation,
};
