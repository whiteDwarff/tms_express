export class ApiResponse {
  /**
   * 표준 성공 응답
   * @param {object} res - express res 객체
   * @param {any} result - 클라이언트에 보낼 데이터
   * @param {number} status - HTTP 상태 코드
   * @param {string} message - 성공 메시지
   */
  static success(res, result, status = 200, message = 'success') {
    res.status(status).json({
      status,
      message,
      result,
    });
  }

  /**
   * 표준 실패/에러 응답
   * @param {object} res - express res
   * @param {object} err - error 객체
   * @param {number} status - HTTP 상태 코드
   */
  static error(res, err, status = 500) {
    res.status(status).json({
      status: status,
      message: err.message || 'Internal Server Error',
      result: err,
    });
  }
}