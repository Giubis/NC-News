const db = require("./db/connection");

const getAllUsers = async () => {
  const queryResult = await db.query("SELECT * FROM users");
  const users = queryResult.rows.map((user) => user.username);
  console.log(users);
  return users;
};

const getAllArticlesByCodingTopic = async () => {
  const queryResult = await db.query(
    "SELECT * FROM articles WHERE topic = 'coding'"
  );
  const articles = queryResult.rows.map((article) => article.title);
  console.log(articles);
  return articles;
};

getAllUsers();
getAllArticlesByCodingTopic();
