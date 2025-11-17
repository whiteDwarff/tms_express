// 파일 폴더를 만들거나 파일이 있는지 확인, 파일을 디스크에 쓰는 작업
import fs from 'fs';
// Node.js의 기본 경로 모듈
import path from 'path';
// 서버 os 구분
import os from 'os';

// 파일이 저장될 경로
// 맥: /Users/사용자명, 윈도우: C/Users/사용자명
const root = os.homedir();

// 모든 파일이 저장될 기본 'uploads' 폴더 경로
const UPLOADS_BASE_DIR = path.join(root, 'uploads');

/**
 * 메모리 버퍼에 있는 파일을 디스크에 저장
 * @param {object} file   - request의 파일 객체
 * @param {string} key    - 파일명에 추가될 텍스트
 * @param {string} subDir - 하위 디렉토리
 * @returns {array}       - 저장된 파일정보
 */
async function saveFileFromMemory(file, subDir, ty = '') {
  if (!file || !file.buffer) {
    throw new Error('유효한 파일 버퍼가 제공되지 않았습니다.');
  }

  try {
    // 최종 저장 경로 설정
    const dir = path.join(UPLOADS_BASE_DIR, subDir);

    // 하위 폴더가 없으면 생성
    if (!fs.existsSync(dir)) {
      // 상위 폴더도 함께 생성
      fs.mkdirSync(dir, { recursive: true });
    }

    // 새 파일명 생성
    const ext = path.extname(file.originalname);
    const newFilename = key ? `${key}_` : '' + String(Date.now()) + ext;
    const savePath = path.join(dir, newFilename);

    // 파일 버퍼를 디스크에 쓰기
    await fs.promises.writeFile(savePath, file.buffer);

    return {
      root: os,
      subDir,
      oriFileName: file.originalname,
      ext,
      fileSize: file.fileSize,
    };
  } catch (err) {
    console.error('파일 저장 중 오류 발생:', err);
    throw new Error('파일을 디스크에 저장하는 데 실패했습니다.');
  }
}

export default {
  saveFileFromMemory,
};
