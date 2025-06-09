const { response } = require("../app");
const {
  selectCommentsByArticleID,
  insertCommentToArticle,
  removeCommentByID,
} = require("../models/comments.model");

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

const postCommentToArticle = async (request, response, next) => {
  try {
    const ID = request.params.article_id;

    if (isNaN(ID)) {
      return response.status(400).send({ message: "Invalid article ID" });
    }

    const { username, body } = request.body;

    if (username === undefined || body === undefined) {
      return response.status(400).send({ message: "Missing required fields" });
    }

    const comment = await insertCommentToArticle(ID, username, body);

    return response.status(201).send({ comment: comment[0] });
  } catch (error) {
    next(error);
  }
};

const deleteCommentByID = async (request, response, next) => {
  try {
    const ID = request.params.comment_id;

    if (isNaN(ID)) {
      return response.status(400).send({ message: "Invalid comment ID" });
    }

    const comment = await removeCommentByID(ID);

    if (!comment.length) {
      return response.status(404).send({ message: "Comment not found" });
    }

    return response.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCommentsByArticleID,
  postCommentToArticle,
  deleteCommentByID,
};
