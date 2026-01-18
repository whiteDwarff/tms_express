// 파일 폴더를 만들거나 파일이 있는지 확인, 파일을 디스크에 쓰는 작업
import fs from 'fs';
// Node.js의 기본 경로 모듈
import path from 'path';
// 서버 os 구분
import os from 'os';

import { v4 as uuidv4 } from 'uuid';

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
 * @returns {object}      - 저장된 파일정보
 */
async function saveFileFromMemory(file, subDir, str = '') {
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

    // 확장자 추출
    const ext = path.extname(file.originalname);
    // 새 파일명 생성
    const savedFileName = `${uuidv4()}-${String(Date.now())}${ext}`;
    // 저장경로
    const savePath = path.join(dir, savedFileName);
    // 안코딩된 파일명을 디코딩
    const oriFileName = Buffer.from(file.originalname, 'latin1').toString('utf8').normalize('NFC');
    // 파일 버퍼를 디스크에 쓰기
    await fs.promises.writeFile(savePath, file.buffer);

    return {
      filePath: path.join('/uploads', subDir),
      oriFileName,
      savedFileName,
      fullPath: `/${path.join('uploads', subDir, savedFileName).replace(/\\/g, '/')}`,
      ext,
      fileSize: file.size,
    };
  } catch (err) {
    console.error('파일 저장 중 오류 발생:', err);
    throw new Error('파일을 저장하는 데 실패했습니다.');
  }
}

/**
 * 저장된 파일을 복사
 * @param {string} fileName - 복사할 파일명
 * @param {string} fromDir  - 소스 디렉토리 (uploads 내 하위 경로)
 * @param {string} toDir    - 대상 디렉토리 (uploads 내 하위 경로)
 */
async function copyFile(fileName, fromDir, toDir) {
  if (!fileName || !fromDir || !toDir) {
    throw new Error('파일명, 소스 디렉토리, 대상 디렉토리는 필수 파라미터입니다.');
  }

  try {
    const srcDir = path.join(UPLOADS_BASE_DIR, fromDir);
    const destDir = path.join(UPLOADS_BASE_DIR, toDir);
    const srcPath = path.join(srcDir, fileName);

    // 파일 존재 유무 확인
    if (!fs.existsSync(srcPath)) throw new Error(`파일을 찾을 수 없습니다: ${srcPath}`);
    // 대상 디렉토리가 없으면 생성
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

    
    const ext = path.extname(fileName);
    // 새로운 파일명 생성
    const savedFileName = `${uuidv4()}-${String(Date.now())}${ext}`;
    const destPath = path.join(destDir, savedFileName);

    // 파일 복사
    await fs.promises.copyFile(srcPath, destPath);

    // 파일 정보 가져오기
    const stats = await fs.promises.stat(srcPath);

    return {
      filePath: path.join('/uploads', toDir),
      oriFileName: fileName,
      savedFileName,
      fullPath: `/${path.join('uploads', toDir, savedFileName).replace(/\\/g, '/')}`,
      ext,
      fileSize: stats.size,
    };
  } catch (err) {
    console.error('파일 복사 중 오류 발생:', err);
    throw new Error(`파일 복사 실패: ${err.message}`);
  }
}

export default {
  saveFileFromMemory,
  copyFile,
};
