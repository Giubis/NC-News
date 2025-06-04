const { getAPI } = require("./controllers/api.controller");
const express = require("express");

const app = express();

app.get("/api", getAPI);

module.exports = app;
