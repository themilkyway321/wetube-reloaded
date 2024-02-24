import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";

import rootRouter from "./routers/rootRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";
import { localsMiddleware } from "./views/middlewares";
import apiRouter from "./routers/apiRouter";

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

app.use(session({
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: false,
  store:MongoStore.create({mongoUrl:process.env.DB_URL})
}));


app.use(localsMiddleware);
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("assets"));
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);
app.use("/api", apiRouter);


export default app;
