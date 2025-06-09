const {
  getAllArticles,
  getArticleByID,
  patchArticleVotes,
} = require("./controllers/articles.controller");
const {
  getCommentsByArticleID,
  postCommentToArticle,
  deleteCommentByID,
} = require("./controllers/comments.controller");
const getAllTopics = require("./controllers/topics.controller");
const { getAllUsers } = require("./controllers/users.controller");
const getAPI = require("./controllers/api.controller");
const express = require("express");
const errorHandler = require("./errors");

const app = express();

app.use(express.json());

app.get("/api", getAPI);

app.get("/api/topics", getAllTopics);

app.get("/api/articles", getAllArticles);

app.get("/api/users", getAllUsers);

app.get("/api/articles/:article_id", getArticleByID);

app.get("/api/articles/:article_id/comments", getCommentsByArticleID);

app.post("/api/articles/:article_id/comments", postCommentToArticle);

app.patch("/api/articles/:article_id", patchArticleVotes);

app.delete("/api/comments/:comment_id", deleteCommentByID);

app.use(errorHandler);

module.exports = app;
