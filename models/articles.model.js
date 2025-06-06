const db = require("../db/connection");

const selectAllArticles = async () => {
  const queryResult = await db.query(
    `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comments.article_id) AS INTEGER) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;`
  );
  return queryResult.rows;
};

const selectArticleByID = async (ID) => {
  const queryResult = await db.query(
    `SELECT * FROM articles WHERE article_id = $1`,
    [ID]
  );
  return queryResult.rows;
};

const updatedArticleVotes = async (ID, vote) => {
  const queryResult = await db.query(
    `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING*;`,
    [vote, ID]
  );
  return queryResult.rows;
};

module.exports = { selectAllArticles, selectArticleByID, updatedArticleVotes };
