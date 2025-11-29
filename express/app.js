import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import dotenv from 'dotenv';
import cors from 'cors';
import os from 'os';
import path from 'path';

// router import
import examInfoRouter from './routes/examInfo.js';
import assignRouter from './routes/assign/index.js';
// 미들웨어용 api response
import { ApiResponse } from './api/utils/response.js';

dotenv.config();

const app = express();
app.set('port', process.env.PORT || 3000);

app.use(morgan('dev'));
app.use('/', express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  cors({
    // 해당 포트에서 오는 요청만 허용
    origin: 'http://localhost:9000',
  }),
);
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
    name: 'session-cookie',
  }),
);

// 이미지 경로 설정
const imgRoot = os.homedir();
const UPLOADS_BASE_DIR = path.join(imgRoot, 'uploads');
app.use('/uploads', express.static(UPLOADS_BASE_DIR));

//  라우터 연결
app.use('/api', examInfoRouter);
app.use('/api', assignRouter);

app.use((req, res, next) => {
  console.log('모든 요청에 다 실행됩니다.');
  next();
});

app.get('/', (req, res) => {
  res.send('Hello, Express');
});

// 404 Not Found 처리 미들웨어
app.use((req, res, next) => {
  const error = new Error(`Server Error :: '${req.originalUrl}' 경로를 찾을 수 없습니다.`);
  error.status = 404;
  next(error);
});

// 중앙 오류 처리
app.use((err, req, res, next) => {
  console.error(err);
  // 404 핸들러 등에서 보낸 status를 사용하고, 없으면 500
  const status = err.httpCode || 500;
  ApiResponse.error(res, err, status);
});

app.listen(app.get('port'), () => {
  console.log(`Server running on port:: ${app.get('port')}`);
});
