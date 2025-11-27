import { BaseError } from './baseError.js';

// 필수 값 누락, 데이터 형식 오류 등 유효성 검사 실패 시
export class ValidationError extends BaseError {
  constructor(message = '입력값이 유효하지 않습니다.', err = null) {
    super(message, 400, true);

    if (err) {
      this.context = err.message;
      this.stack = err.stack;
    }
  }
}
// 로그인 실패, 토큰 만료 등 인증 관련 오류 시
export class NotFoundError extends BaseError {
  constructor(message = '데이터가 없습니다.', err = null) {
    super(message, 404, true);

    if (err) {
      this.context = err.message;
      this.stack = err.stack;
    }
  }
}
// 로그인 실패, 토큰 만료 등 인증 관련 오류 시
export class AuthenticationError extends BaseError {
  constructor(message = '아이디 또는 비밀번호가 일치하지 않습니다.', err = null) {
    super(message, 401, true);

    if (err) {
      this.context = err.message;
      this.stack = err.stack;
    }
  }
}
// 데이터 베이스 오류
export class DatabaseError extends BaseError {
  /**
   * @param {string} message
   * @param {Error} originalError
   */
  constructor(message = '데이터 처리 중 오류가 발생했습니다.', err = null) {
    super(message, 500, true);
    // 원본 에러의 상세 정보를 속성으로 저장
    if (err) {
      this.context = err.message;
      this.stack = err.stack;
    }
  }
}

export const serviceErrorHandler = (err) => {
  console.log('-------------------------------------');
  console.log(err);
  console.log('-------------------------------------');

  // 이미 BaseError의 인스턴스인 경우 (Custom Error)는 그대로 전달
  if (err instanceof BaseError) {
    throw err;
  }

  // PostgreSQL/pg 드라이버 데이터베이스 에러 확인
  if (err.code && err.severity) {
    // 데이터 무결성 오류

    switch (err.code) {
      case '23502': // not_null_violation (NOT NULL 제약 조건 위반)
        throw new ValidationError('필수 입력값이 누락되었습니다.', err);

      case '23505': // unique_violation (UNIQUE/PRIMARY KEY 제약 조건 위반)
        throw new ValidationError('이미 존재하는 데이터입니다.', err);

      case '23503': // foreign_key_violation (외래 키 제약 조건 위반)
        throw new ValidationError('존재하지 않는 참조 키를 사용했습니다.', err);

      case '23514': // check_violation (CHECK 제약 조건 위반)
        throw new ValidationError('입력값이 허용 범위를 벗어났습니다.', err);
    }

    // 스키마/쿼리 오류
    switch (err.code) {
      case '42P01': // undefined_table (테이블 없음)
      case '42703': // undefined_column (칼럼 없음)
      case '42601': // syntax_error (SQL 문법 오류)
        throw new DatabaseError('내부 시스템 오류 (DB 스키마/쿼리 정의 문제)', err);

      case '42501': // insufficient_privilege (권한 부족)
        throw new DatabaseError('데이터베이스 접근 권한이 부족합니다.', err);

      default:
        // 위에 해당하지 않는 모든 예상치 못한 DB 오류
        throw new DatabaseError('데이터 처리 중 예상치 못한 DB 오류 발생', err);
    }
  }

  // 4. 위에 해당하지 않는 예상치 못한 일반 JavaScript 에러 (500 에러 처리)
  throw new DatabaseError(err.message, err);
};
