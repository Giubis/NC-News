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

module.exports = { selectCommentsByArticleID };
