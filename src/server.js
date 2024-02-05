import express from "express";

// express 를 실현하는 어플리케이션
const app = express();
const PORT = 4000;
const handleListening = () =>
  console.log(`✅ Server listenting on port http://localhost:${PORT} 🚀`);

const handleHome = (req, res)=> {
    return res.send("hi miri");
};
const handleLogin = (req, res)=> {
    return res.send("login here");
};
//express 앱 서버가 들을 수 있도록


app.get("/", handleHome);
app.get("/login", handleLogin);
app.listen(PORT, handleListening);

