import fileService from '#root/api/file/service/fileService.js';
import { NotFoundError, ValidationError } from '#root/error/index.js';
import { validFileExt } from '#root/common/validate-rules.js';

import dotenv from 'dotenv';
dotenv.config();

/**
 * 응시자 등록 및 수정
 * @param {object} params - 첨부파일 경로 및 등록 정보
 * @param {array}  files  - 첨부파일 목록
 * @returns - 결과
 */
const editorImageUpload = async (params, files) => {
  const images = [];
  const exts = ['.jpg', '.jpeg', '.png', '.gif'];
  const maxSize = process.env.MAX_FILE_SIZE;

  // 파일이 있다면 저장
  if (files.length && params.dir) {
    for (let file of files) {
      // 파일크기 검사
      if (file.size > maxSize)
        throw new ValidationError('최대 등록 가능한 파일 크기는 10MB 입니다.');
      // 파일 확장자 검사
      if (validFileExt({ name: file.originalname }, exts)) {
        const { fullPath } = await fileService.saveFileFromMemory(file, params.dir);
        images.push(fullPath);
      } else throw new ValidationError(`[${exts.join(', ')}] 확장자만 등록할 수 있습니다.`);
    }

    if (images.length) return { images };
    else throw new NotFoundError('등록 가능한 첨부파일이 없습니다.');
  } else throw new NotFoundError('등록 가능한 첨부파일이 없습니다.');
};

export default { editorImageUpload };
