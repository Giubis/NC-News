const { selectCommentsByArticleID } = require("../models/comments.model");

const getCommentsByArticleID = async (request, response, next) => {
  try {
    const ID = request.params.article_id;

    if (isNaN(ID)) {
      return response.status(400).send({ message: "Invalid article ID" });
    }

    const comments = await selectCommentsByArticleID(ID);

    if (!comments.length) {
      return response.status(404).send({ message: "Article not found" });
    }

    if (comments[0].comment_id === null) {
      return response.status(200).send({ message: "No comments yet" });
    }

    return response.status(200).send({ comments });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCommentsByArticleID };
