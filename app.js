const getAllTopics = require("./controllers/topics.controller");
const getAPI = require("./controllers/api.controller");
const express = require("express");

const app = express();

app.get("/api", getAPI);

app.get("/api/topics", getAllTopics);

module.exports = app;
