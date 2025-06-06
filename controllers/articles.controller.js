const {
  selectAllArticles,
  selectArticleByID,
} = require("../models/articles.model");

const getAllArticles = async (request, response) => {
  const articles = await selectAllArticles();
  return response.status(200).send({ articles });
};

const getArticleByID = async (request, response, next) => {
  try {
    const ID = request.params.article_id;

    if (isNaN(ID)) {
      return response.status(400).send({ message: "Invalid article ID" });
    }

    const article = await selectArticleByID(ID);

    if (!article.length) {
      return response.status(404).send({ message: "Article not found" });
    }

    return response.status(200).send({ article: article[0] });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllArticles, getArticleByID };
