const getAllArticles = require("./controllers/articles.controller");
const getAllTopics = require("./controllers/topics.controller");
const getAllUsers = require("./controllers/users.controller");
const getAPI = require("./controllers/api.controller");
const express = require("express");

const app = express();

app.get("/api", getAPI);

app.get("/api/topics", getAllTopics);

app.get("/api/articles", getAllArticles);

app.get("/api/users", getAllUsers);

module.exports = app;
