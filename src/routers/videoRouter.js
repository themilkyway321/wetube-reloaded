import express from "express";
import { getEdit, getUpload, postEdit, postUpload, see, deleteVideo } from "../controllers/videoController";


const videoRouter = express.Router();


videoRouter.get("/:id([0-9a-f]{24})", see);
videoRouter.route("/:id([0-9a-f]{24})/edit").get(getEdit).post(postEdit); //아래 upload post get처럼 두줄 코드를 한줄로 쓰려면 이렇게. 
videoRouter.route("/:id([0-9a-f]{24})/delete").get(deleteVideo); //아래 upload post get처럼 두줄 코드를 한줄로 쓰려면 이렇게. 
videoRouter.get("/upload", getUpload);
videoRouter.post("/upload", postUpload);



export default videoRouter;