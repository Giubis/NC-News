const db = require("../connection");
const format = require("pg-format");
const { convertTimestampToDate } = require("../seeds/utils");

const seed = async ({ topicData, userData, articleData, commentData }) => {
  await db.query(`DROP TABLE IF EXISTS comments, articles, users, topics;`);

  await db.query(`
    CREATE TABLE topics (
      slug VARCHAR(50) PRIMARY KEY,
      description VARCHAR(50) NOT NULL,
      img_url VARCHAR(1000)
    );
  `);

  await db.query(`
    CREATE TABLE users (
      username VARCHAR(50) PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      avatar_url VARCHAR(1000)
    );
  `);

  await db.query(`
    CREATE TABLE articles (
      article_id SERIAL PRIMARY KEY,
      title VARCHAR(500) NOT NULL,
      topic VARCHAR(50)
      REFERENCES topics(slug) NOT NULL,
      author VARCHAR(50) REFERENCES users(username) NOT NULL,
      body TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      votes INT DEFAULT 0,
      article_img_url VARCHAR(1000)
    );
  `);

  await db.query(`
    CREATE TABLE comments (
      comment_id SERIAL PRIMARY KEY,
      article_id INT REFERENCES articles(article_id) ON DELETE CASCADE,
      body TEXT NOT NULL,
      votes INT DEFAULT 0,
      author VARCHAR(50) REFERENCES users(username) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const insertTopicsQuery = format(
    `INSERT INTO topics (slug, description, img_url) VALUES %L;`,
    topicData.map(({ slug, description, img_url }) => [
      slug,
      description,
      img_url,
    ])
  );
  await db.query(insertTopicsQuery);

  const insertUsersQuery = format(
    `INSERT INTO users (username, name, avatar_url) VALUES %L;`,
    userData.map(({ username, name, avatar_url }) => [
      username,
      name,
      avatar_url,
    ])
  );
  await db.query(insertUsersQuery);

  const formattedArticleData = articleData.map((article) =>
    convertTimestampToDate(article)
  );

  const insertArticlesQuery = format(
    `INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url)
     VALUES %L RETURNING *;`,
    formattedArticleData.map(
      ({
        title,
        topic,
        author,
        body,
        created_at,
        votes = 0,
        article_img_url,
      }) => [title, topic, author, body, created_at, votes, article_img_url]
    )
  );

  const queryResult = await db.query(insertArticlesQuery);
  const insertedArticles = queryResult.rows;

  // console.log(Object.keys(queryResult));
  // console.log(insertedArticles[1]);

  const articleLookup = {};
  insertedArticles.forEach(({ title, article_id }) => {
    articleLookup[title] = article_id;
  });

  const formattedCommentData = commentData.map((comment) =>
    convertTimestampToDate(comment)
  );

  const insertCommentsQuery = format(
    `INSERT INTO comments (body, votes, author, article_id, created_at)
     VALUES %L;`,
    formattedCommentData.map(
      ({ body, votes = 0, author, article_title, created_at }) => [
        body,
        votes,
        author,
        articleLookup[article_title],
        created_at,
      ]
    )
  );
  await db.query(insertCommentsQuery);
};

module.exports = seed;
