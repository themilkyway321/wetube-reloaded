import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";

const s3 = new S3Client({
    region: "ap-northeast-2",
    credentials: {
        accessKeyId: process.env.AWS_ID,
        secretAccessKey: process.env.AWS_SECRET,
    }
});

const s3ImageUploader = multerS3({
    s3: s3,
    bucket: 'webtubemiri',
    acl: 'public-read',
    key: function (request, file, ab_callback) {
        const newFileName = Date.now() + "-" + file.originalname;
        const fullPath = "images/" + newFileName;
        ab_callback(null, fullPath);
        console.log(file);
    },
});

const s3VideoUploader = multerS3({
    s3: s3,
    bucket: 'webtubemiri',
    acl: 'public-read',
    key: function (request, file, ab_callback) {
        const newFileName = Date.now() + "-" + file.originalname;
        const fullPath = "videos/" + newFileName;
        ab_callback(null, fullPath);
    },
});

export const localsMiddleware = (req, res, next)=>{
    console.log(req.session);
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.loggedInUser= req.session.user || {};
    // console.log(res.locals.loggedInUser);
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
        req.flash("error", "Log in first.");
        return res.redirect("/login");
    }

}

//로그아웃상태여야만 갈 수 있도록 
//join, login, github/start, github/finigh 에 미들웨어 추가
export const publicOnlyMiddleware = (req, res, next)=>{
    if(!req.session.loggedIn){
        return next();
    } else {
        req.flash("error", "Not authorized");
        return res.redirect("/");
    }

}


export const avatarUpload = multer({
    dest: "uploads/avatars/",
    limits: {
      fileSize: 3000000,
    },
    storage:s3ImageUploader, 
  });
  export const videoUpload = multer({
    dest: "uploads/videos/",
    limits: {
      fileSize: 100000000,
    },
    storage:s3VideoUploader,
  });