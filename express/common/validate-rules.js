/**
 * 이메일 유효성 검사
 * @param {string} value
 * @returns {boolean}
 */
export function validEmail(value) {
  const reg =
    /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
  return reg.test(value);
}
/**
 * 전화번호 유효성 검사
 * @param {string} value
 * @returns {boolean}
 */
export function validTel(value) {
  const reg = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
  return reg.test(value);
}
/**
 * 비밀번호 유효성 검사
 * @param {string} value
 * @returns {boolean}
 */
export function validPassword(value) {
  const reg = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/;
  return reg.test(value);
}
/**
 * 입력값이 한글로만 구성되어 있는지 검사
 * @param {any} value
 * @returns {boolean}
 */
export function validOnlyKR(value) {
  const reg = /^[가-힣\s]+$/;
  return reg.test(value);
}
/**
 * 영어 알파벳으로만 구성되어 있는지 검사
 * @param {any} value
 * @returns {boolean}
 */
export function validOnlyEN(value) {
  const reg = /^[a-zA-Z\s]+$/;
  return reg.test(value);
}
/**
 * 숫자로만 구성되어 있는지 검사
 * @param {any} value
 * @returns {boolean}
 */
export function validNumber(value) {
  return !isNaN(value);
}
/**
 * 특수문자를 제외하고 영문자와 숫자로만 구성된 문자열인지 검사
 * @param {any} value
 * @returns {boolean}
 */
export function validString(value) {
  if (typeof value !== 'string') return false;
  return /^[a-zA-Z0-9]+$/.test(value) && /[a-zA-Z]/.test(value);
}
/**
 * 날짜 형식(YYYY-MM-DD)이 맞는지 검사
 * @param {string} value - 날짜형식
 * @returns {boolean}    - 참/거짓
 */
export function validDate(value) {
  const reg = /^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
  return reg.test(value);
}
/**
 * 파일명에서 확장자를 추출하여 등록가능한 파일인지 확인
 * @param {file} file  - 등록된 파일
 * @param {array} exts - 등록가능한 파일목록
 * @returns {boolean}
 */
export function validFileExt(file, exts) {
  if (!file || !exts || !exts.length) return false;

  const fileName = file.name;
  const dotIndex = fileName.lastIndexOf('.');
  const ext = dotIndex !== -1 ? fileName.slice(dotIndex).toLowerCase() : '';

  return exts.map((ext) => ext.toLowerCase()).includes(ext) ? true : false;
}
