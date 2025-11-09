/**
 * 결과 배열에서 로우 개수(count)를 추출하여 반환
 * @param {arr} arr - 쿼리결과
 * @returns         - 총 개수
 */
export function extractCount(arr) {
  if (!arr || !arr.length || !arr[0]?.count) return 0;
  return parseInt(arr[0].count);
}
