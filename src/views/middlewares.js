import multer from "multer";

export const localsMiddleware = (req, res, next)=>{
    console.log(req.session);
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.loggedInUser= req.session.user || {};
    res.locals.siteName = "Webtube"
    next();
    // res.locals.siteName = 
}


//로그인해야만갈 수 있도록
//logout, edit에 미들웨어 추가 
//video edit delete, upload 에도 추가 
export const protectorMiddleware =(req, res, next) =>{
    if(req.session.loggedIn){
        return next();
    } else {
        return res.redirect("/login");
    }

}

//로그아웃상태여야만 갈 수 있도록 
//join, login, github/start, github/finigh 에 미들웨어 추가
export const publicOnlyMiddleware = (req, res, next)=>{
    if(!req.session.loggedIn){
        return next();
    } else {
        return res.redirect("/");
    }

}


export const avatarUpload = multer({
    dest: "uploads/avatars/",
    limits: {
      fileSize: 3000000,
    },
  });
  export const videoUpload = multer({
    dest: "uploads/videos/",
    limits: {
      fileSize: 10000000,
    },
  });