import axios from 'axios';
import fileService from '#root/api/file/service/fileService.js';

/**
 * 텍스트 프롬프트를 통해 이미지 생성
 * @param {object} param - 프롬프트, 모델, 이미지 크기
 * @returns {object} - 생성된 이미지 정보
 * @doc https://pollinations.ai/
 */
export async function generateImage(param) {
  try {
    const prompt = [
      { 
        quality: 'lower', 
        prompt: `Flat vector illustration of ${param.prompt}, vibrant colors` 
      },
      { 
        quality: 'simple', 
        prompt: `Flat vector illustration of ${param.prompt}, clean lines, minimal style, 2d art` 
      },
      { 
        quality: 'high', 
        prompt: `Flat vector art of ${param.prompt}, vibrant colors, high detail, masterpiece` 
      },
      { 
        quality: 'digital', 
        prompt: `Digital illustration of ${param.prompt}, artistic painting style, highly expressive` 
      },
      { 
        quality: 'pop', 
        prompt: `Pop art style illustration of ${param.prompt}, bold outlines, cel shaded, comic book style` 
      },
    ].find(({ quality }) => quality == param.quality).prompt;
    console.log('---- param ---');
    console.log(param);
    console.log('---- prompt ---');
    console.log(prompt)

    const query = {
      width: param.size,   // 가로크기
      height: param.size,  // 세로크기
      nologo: true,        // 워터마크 제거
      seed: Math.floor(Math.random() * 10000000),  // 랜덤시드
      cache: false,
      // model: 'flux',
    }
    const queryString = new URLSearchParams(query).toString();
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?${queryString}`;

    const res = await axios.get(url, { responseType: 'arraybuffer' });
    if (res.status == 200) {
      const obj = {
        buffer: Buffer.from(res.data),          // axios 응답 데이터를 노드 버퍼로 변환
        originalname: 'ai_generated_image.jpg', // 기본 이름 설정
        size: res.data.byteLength
      }
      return await fileService.saveFileFromMemory(obj, 'ai_gen');
    } 
    return new Error('이미지 생성 실패하였습니다.');
  } catch (err) {
    console.error(err);
    throw new Error('이미지 생성 실패하였습니다.');
  }
}

