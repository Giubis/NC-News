const db = require("../db/connection");

const selectCommentsByArticleID = async (ID) => {
  const queryResult = await db.query(
    `SELECT comments.*
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    WHERE articles.article_id = $1
    ORDER BY comments.created_at DESC;`,
    [ID]
  );

  return queryResult.rows;
};

const insertCommentToArticle = async (ID, username, body) => {
  const queryResult = await db.query(
    `INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING*`,
    [ID, username, body]
  );
  return queryResult.rows[0];
};

module.exports = { selectCommentsByArticleID, insertCommentToArticle };
