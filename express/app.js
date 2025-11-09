import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import session from "express-session";
import dotenv from "dotenv";
import cors from "cors";

// router import
import examInfoRouter from "./routes/examInfo.js";

dotenv.config();

const app = express();
app.set("port", process.env.PORT || 3000);

app.use(morgan("dev"));
app.use("/", express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  cors({
    // 해당 포트에서 오는 요청만 허용
    origin: "http://localhost:9000",
  })
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
    name: "session-cookie",
  })
);

// 5. 라우터 연결
app.use("/api", examInfoRouter);

app.use((req, res, next) => {
  console.log("모든 요청에 다 실행됩니다.");
  next();
});

app.get("/", (req, res) => {
  res.send("Hello, Express");
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기 중");
});
