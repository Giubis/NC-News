const {
  getAllArticles,
  getArticleByID,
} = require("./controllers/articles.controller");
const { getCommentsByArticleID } = require("./controllers/comments.controller");
const getAllTopics = require("./controllers/topics.controller");
const { getAllUsers } = require("./controllers/users.controller");
const getAPI = require("./controllers/api.controller");
const express = require("express");
const errorHandler = require("./errors");

const app = express();

app.get("/api", getAPI);

app.get("/api/topics", getAllTopics);

app.get("/api/articles", getAllArticles);

app.get("/api/users", getAllUsers);

app.get("/api/articles/:article_id", getArticleByID);

app.get("/api/articles/:article_id/comments", getCommentsByArticleID);

app.use(errorHandler);

module.exports = app;
