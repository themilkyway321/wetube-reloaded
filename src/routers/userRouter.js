import express from "express";
import { logout, remove, see, startGithubLogin, finishGithubLogin, getEdit, postEdit } from "../controllers/userController";


const userRouter = express.Router();
userRouter.get("/logout", logout);
userRouter.route("/edit").get(getEdit).post(postEdit);
userRouter.get("/github/start", startGithubLogin);
userRouter.get("/github/finish", finishGithubLogin);
userRouter.get(":id(\\d+)", see);


export default userRouter;