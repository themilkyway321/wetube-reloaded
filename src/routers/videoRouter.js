import express from "express";
import { getEdit, getUpload, postEdit, postUpload, see, deleteVideo } from "../controllers/videoController";
import { protectorMiddleware, videoUpload } from "../views/middlewares";


const videoRouter = express.Router();


videoRouter.get("/:id([0-9a-f]{24})", see);
videoRouter.route("/:id([0-9a-f]{24})/edit").all(protectorMiddleware).get(getEdit).post(postEdit); //아래 upload post get처럼 두줄 코드를 한줄로 쓰려면 이렇게. 
videoRouter.route("/:id([0-9a-f]{24})/delete").all(protectorMiddleware).get(deleteVideo); //아래 upload post get처럼 두줄 코드를 한줄로 쓰려면 이렇게. 

videoRouter.route("/upload").all(protectorMiddleware).get(getUpload)
.post(videoUpload.fields([{name:"video", maxCount:1},{name:"thumb", maxCount:1}]), postUpload);




export default videoRouter;