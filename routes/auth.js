import express from "express";
import { login, register, verifyUser } from "../controller/auth.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/verify", verifyUser);

export default authRouter;