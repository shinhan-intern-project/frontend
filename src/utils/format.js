// src/utils/format.js
export function addComma(cost) {
  // 문자열인 경우 숫자로 변환
  const num = typeof cost === 'string' ? parseInt(cost.replace(/,/g, ''), 10) : cost;

  if (isNaN(num)) return '0';

  return num.toLocaleString(); // 천 단위 콤마 자동 처리
}
