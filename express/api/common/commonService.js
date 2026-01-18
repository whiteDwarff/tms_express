import fileService from '#root/api/file/service/fileService.js';
import { NotFoundError, ValidationError } from '#root/error/index.js';
import { validFileExt } from '#root/common/validate-rules.js';

import { translateKoToEn } from '#root/api/utils/papago.js';
import { generateImage } from '#root/api/utils/pollinations.js';

import dotenv from 'dotenv';
dotenv.config();

/**
 * 이미지 등록
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

/**
 * 이미지 생성
 * @param {object} param - 프롬프트, 모델, 이미지 크기
 * @returns - 생성된 이미지 정보
 */
const generateImageFromPrompt = async (param) => {
  try {
    // 한글로 입력된 프롬프트를 영문으로 번역
    const transRes = await translateKoToEn(param.prompt);
    if (transRes.status == 200) {
      // 번역된 텍스트와 파라미터를 통해 이미지 요청
      const imageRes = await generateImage({
        ...param,
        prompt: transRes.text
      });

      if (imageRes) return imageRes;
    }
  } catch(err) {
    console.log(err);
  }
}


export default { 
  editorImageUpload, 
  generateImageFromPrompt
};
