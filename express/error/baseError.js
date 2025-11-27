/**
 * 모든 커스텀 에러가 상속받는 기본 클래스
 * @param {string} message - 사용자에게 보여줄 메시지
 * @param {number} httpCode - 에러에 매칭되는 HTTP 상태 코드
 * @param {boolean} isOperational - 개발자가 예상한 '운영 에러'인지 여부 (트랜잭션 롤백 등 처리 결정에 사용)
 */
export class BaseError extends Error {
  constructor(message, httpCode, isOperational = true) {
    super(message);
    this.name = this.constructor.name;
    this.httpCode = httpCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}
