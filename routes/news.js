import express from "express";
import { getNews, getNewsById } from "../controller/news.js";

const newsRouter = express.Router();

newsRouter.get("/news", getNews);
newsRouter.get("/news/:id", getNewsById);

export default newsRouter;