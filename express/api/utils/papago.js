import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

/**
 * @param {string} text - 번역할 텍스트
 * @returns {Promise<{status: number, message: string}>}
 * https://api.ncloud-docs.com/docs/ai-naver-papagonmt-translation
 */
export async function translateKoToEn(text) {
  if (!text) return {
    status: 404,
    message: '번역할 텍스트가 없습니다.'
  }

  const headers = {
    'X-NCP-APIGW-API-KEY-ID': process.env.PAPAGO_KEY_ID,
    'X-NCP-APIGW-API-KEY': process.env.PAPAGO_KEY,
    'Content-Type': 'application/json'
  };

  const data = { 
    source: 'auto', // 텍스트 언어는 자동감지
    target: 'en',   // 무조건 영어로 번역
    text 
  };

  try {
    const res = await axios.post('https://papago.apigw.ntruss.com/nmt/v1/translation', data, { headers });

    if (res.status == 200 && res?.data?.message) {
      const { translatedText: prompt } = res.data.message.result;
      return {
        status: 200, prompt
      }
    }
  } catch (error) {
    console.error('papago 번역 에러:', error.message);
    throw new Error('papago 번역에 실패하였습니다.');
  }
}