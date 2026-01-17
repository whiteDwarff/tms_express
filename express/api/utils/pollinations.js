import axios from 'axios';
import fileService from '#root/api/file/service/fileService.js';


/**
 * 텍스트 프롬프트를 통해 이미지 생성
 * @param {*} prompt 
 * @returns 
 * https://pollinations.ai/
 */
export async function generateImage(prompt) {
  try {
    /**
    심플 벡터	flat vector illustration, clean lines, minimal style, 2d art	깔끔하고 현대적인 웹/앱 디자인 느낌
    디지털 페인팅	digital illustration, artistic painting, soft lighting, concept art	부드럽고 깊이 있는 예술적 느낌 (교육용 권장)
    팝아트/코믹스	pop art style, bold outlines, cel shaded, comic book	선이 굵고 눈에 확 띄는 강렬한 그래픽 느낌
    고품질 플랫	flat vector art, vibrant colors, high detail, masterpiece	색감이 화려하고 완성도가 높은 화보 느낌
    속도 최적화	Flat vector illustration, vibrant colors	불필요한 연산을 줄인 가장 빠른 기본 일러스트
     */

    const enhancedPrompt = `Minimalist vector illustration of ${prompt}, clean lines, vibrant colors, 2d, high quality`;

    const query = {
      width: 256,      // 가로크기
      height: 256,     // 세로크기
      nologo: true,    // 워터마크 제거
      seed: Date.now() // 랜덤시드
      // model: 'flux',
    }
    const queryString = new URLSearchParams(query).toString();
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?${queryString}`;

    const res = await axios.get(url, { responseType: 'arraybuffer' });

    if (res.status == 200) {
      const obj = {
        buffer: Buffer.from(res.data),          // axios 응답 데이터를 노드 버퍼로 변환
        originalname: 'ai_generated_image.jpg', // 기본 이름 설정
        size: res.data.byteLength
      }
      return await fileService.saveFileFromMemory(obj, 'ai_gen');
    } 
    return null;
  } catch (err) {
    console.error(err);
    throw new Error('이미지 생성 실패하였습니다.');
  }
}

