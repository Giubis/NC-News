const {
  selectAllArticles,
  selectArticleByID,
  updatedArticleVotes,
} = require("../models/articles.model");

const getAllArticles = async (request, response, next) => {
  try {
    const articles = await selectAllArticles();
    return response.status(200).send({ articles });
  } catch (error) {
    next(error);
  }
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

const patchArticleVotes = async (request, response, next) => {
  try {
    const ID = request.params.article_id;

    if (isNaN(ID)) {
      return response.status(400).send({ message: "Invalid article ID" });
    }

    const vote = request.body.inc_votes;

    if (vote === undefined) {
      return response.status(400).send({ message: "Missing vote" });
    }

    if (isNaN(vote)) {
      return response
        .status(400)
        .send({ message: "The vote must be a valid number" });
    }

    if (!Number.isInteger(vote)) {
      return response
        .status(400)
        .send({ message: "The vote must be a valid number" });
    }

    if (vote === 0) {
      return response
        .status(422)
        .send({ message: "The vote must be greater or lower than 0" });
    }

    const article = await updatedArticleVotes(ID, vote);

    if (!article.length) {
      return response.status(404).send({ message: "Article not found" });
    }

    return response.status(200).send({ article: article[0] });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllArticles, getArticleByID, patchArticleVotes };
