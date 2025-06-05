const selectAllArticles = require("../models/articles.model");

const getAllArticles = async (request, response) => {
  const articles = await selectAllArticles();
  return response.status(200).send({ articles });
};

module.exports = getAllArticles;
