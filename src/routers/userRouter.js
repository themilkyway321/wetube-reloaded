import express from "express";
import { userEdit, logout, remove, see, startGithubLogin, finishGithubLogin } from "../controllers/userController";


const userRouter = express.Router();
userRouter.get("/logout", logout);
userRouter.get("/edit", userEdit);
userRouter.get("/github/start", startGithubLogin);
userRouter.get("/github/finish", finishGithubLogin);
userRouter.get(":id(\\d+)", see);


export default userRouter;