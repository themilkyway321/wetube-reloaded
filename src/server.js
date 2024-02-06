import express from "express";

// express 를 실현하는 app 
const app = express();
const PORT = 4000;
const handleListening = () => console.log(`✅ Server listenting on port http://localhost:${PORT} 🚀`);


const handleLogin = (req, res)=> {
    return res.send("login here");
};
//express 앱 서버가 들을 수 있도록

const logger = (req, res, next) =>{
  console.log(`${req.method}, ${req.url}`);
  next();
}
const handleHome = (req, res)=> {
  console.log("how about this?")
  return res.send("hi miri");
};
app.get("/", logger, handleHome);
app.get("/login", handleLogin);
app.listen(PORT, handleListening);

