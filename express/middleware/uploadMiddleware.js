import multer from 'multer';

// 디스크가 아닌 메모리에 저장
const storage = multer.memoryStorage();

// 파일 크기 10MB로 제한
const limits = { fileSize: 10 * 1024 * 1024 };

// 인스턴스 생성 및 내보내기
const upload = multer({
  storage: storage,
  limits: limits,
});

export default upload;
