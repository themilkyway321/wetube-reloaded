
import express from "express";
import morgan from "morgan";

import globalRouter from "./routers/globalRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";

// express 를 실현하는 app 
const app = express();


const logger = morgan("dev")

//express 앱 서버가 들을 수 있도록


const handleHome = (req, res)=> {
  return res.send("hi miri");
};

app.set("view engine", "pug");
app.set("views", process.cwd()+"/src/views");
app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);



export default app;
