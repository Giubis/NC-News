const db = require("./db/connection");

const getAllUsers = async () => {
  const queryResult = await db.query("SELECT * FROM users");
  const users = queryResult.rows.map((user) => user.username);
  // console.log(users);
  return users;
};

const getAllArticlesByCodingTopic = async () => {
  const queryResult = await db.query(
    "SELECT * FROM articles WHERE topic = 'coding'"
  );
  const articles = queryResult.rows.map((article) => article.title);
  // console.log(articles);
  return articles;
};

const getAllCommentsWithNegativeRating = async () => {
  const queryResult = await db.query(
    "SELECT * FROM comments WHERE votes < '0'"
  );
  const comments = queryResult.rows.map((comment) => comment);
  // console.log(comments);
  return comments;
};

const getAllArticlesByGrumpy19 = async () => {
  const queryResult = await db.query(
    "SELECT * FROM articles WHERE author = 'grumpy19'"
  );
  const articles = queryResult.rows.map((article) => article);
  // console.log(articles);
  return articles;
};

const getAllCommentsWithMoreTenVotes = async () => {
  const queryResult = await db.query(
    "SELECT * FROM comments WHERE votes > 10 OR votes < -10"
  );
  const comments = queryResult.rows.map((comment) => comment);
  // console.log(comments);
  return comments;
};
