const app = require("../app");
const data = require("../db/data/test-data");
const db = require("../db/connection");
const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const seed = require("../db/seeds/seed");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("200: Test 1 - Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Test 1 - Responds with an object containing a 'topics' array", async () => {
    const response = await request(app).get("/api/topics").expect(200);

    expect(response.body).toHaveProperty("topics");
    expect(Array.isArray(response.body.topics)).toBe(true);
  });
  test("200: Test 2 - Each item in 'topics' has properties named 'slug' and 'description'", async () => {
    const response = await request(app).get("/api/topics").expect(200);

    response.body.topics.forEach((topic) => {
      expect(topic).toHaveProperty("slug");
      expect(typeof topic.slug).toBe("string");
      expect(topic).toHaveProperty("description");
      expect(typeof topic.description).toBe("string");
    });
  });
});

describe("GET /api/articles", () => {
  test("200: Test 1 - Responds with an object containing a 'articles' array", async () => {
    const response = await request(app).get("/api/articles").expect(200);

    expect(response.body).toHaveProperty("articles");
    expect(Array.isArray(response.body.articles)).toBe(true);
  });
  test("200: Test 2 - Each item in 'articles' have properties named 'author', 'title', ''article_id, 'topic', 'created_at', 'votes', 'article_img_url', and 'comment_count'", async () => {
    const response = await request(app).get("/api/articles").expect(200);

    response.body.articles.forEach((article) => {
      expect(article).toHaveProperty("author");
      expect(typeof article.author).toBe("string");
      expect(article).toHaveProperty("title");
      expect(typeof article.title).toBe("string");
      expect(article).toHaveProperty("article_id");
      expect(typeof article.article_id).toBe("number");
      expect(article).toHaveProperty("topic");
      expect(typeof article.topic).toBe("string");
      expect(article).toHaveProperty("created_at");
      expect(typeof article.created_at).toBe("string");
      expect(article).toHaveProperty("votes");
      expect(typeof article.votes).toBe("number");
      expect(article).toHaveProperty("article_img_url");
      expect(typeof article.article_img_url).toBe("string");
      expect(article).toHaveProperty("comment_count");
      expect(typeof article.comment_count).toBe("number");
    });
  });
  test("200: Test 3 - The 'articles' items are sorted by date in descending order", async () => {
    const response = await request(app).get("/api/articles").expect(200);
    const sortedArray = response.body.articles.toSorted(
      (a, b) => Date.parse(b.created_at) - Date.parse(a.created_at)
    );
    const expected = response.body.articles;

    expect(sortedArray).toEqual(expected);
  });
  test("200: Test 4 - Each item in 'articles' does not have a property named 'body'", async () => {
    const response = await request(app).get("/api/articles").expect(200);

    response.body.articles.forEach((article) => {
      expect(article).not.toHaveProperty("body");
    });
  });
});

describe("GET /api/users", () => {
  test("200: Test 1 - Responds with an object containing a 'users' array", async () => {
    const response = await request(app).get("/api/users").expect(200);

    expect(response.body).toHaveProperty("users");
    expect(Array.isArray(response.body.users)).toBe(true);
  });
  test("200: Test 2 - Each item in 'users' have properties named 'username', 'name', and 'avatar_url'", async () => {
    const response = await request(app).get("/api/users").expect(200);

    response.body.users.forEach((user) => {
      expect(user).toHaveProperty("username");
      expect(typeof user.username).toBe("string");
      expect(user).toHaveProperty("name");
      expect(typeof user.name).toBe("string");
      expect(user).toHaveProperty("avatar_url");
      expect(typeof user.avatar_url).toBe("string");
    });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Test 1 - Responds with a 'article' object", async () => {
    const response = await request(app).get("/api/articles/1").expect(200);

    expect(response.body).toHaveProperty("article");
    expect(typeof response.body.article).toBe("object");
    expect(Array.isArray(response.body.article)).toBe(false);
  });
  test("200: Test 2 - Each item in 'articles' have properties named 'author', 'title', ''article_id, 'topic', 'created_at', 'votes', 'article_img_url', and 'comment_count'", async () => {
    const response = await request(app).get("/api/articles/1").expect(200);

    expect(response.body.article).toHaveProperty("author");
    expect(typeof response.body.article.author).toBe("string");
    expect(response.body.article).toHaveProperty("title");
    expect(typeof response.body.article.title).toBe("string");
    expect(response.body.article).toHaveProperty("article_id", 1);
    expect(typeof response.body.article.article_id).toBe("number");
    expect(response.body.article).toHaveProperty("body");
    expect(typeof response.body.article.body).toBe("string");
    expect(response.body.article).toHaveProperty("topic");
    expect(typeof response.body.article.topic).toBe("string");
    expect(response.body.article).toHaveProperty("created_at");
    expect(typeof response.body.article.created_at).toBe("string");
    expect(response.body.article).toHaveProperty("votes");
    expect(typeof response.body.article.votes).toBe("number");
    expect(response.body.article).toHaveProperty("article_img_url");
    expect(typeof response.body.article.article_img_url).toBe("string");
  });
  test("400: Test 3 - The parametric endpoint 'article_id' is not a valid integer", async () => {
    const response = await request(app)
      .get("/api/articles/article1")
      .expect(400);
    expect(response.body.message).toBe("Invalid article ID");
  });
  test("404: Test 4 - The parametric endpoint points to a non-existent 'article_id'", async () => {
    const response = await request(app).get("/api/articles/9999").expect(404);
    expect(response.body.message).toBe("Article not found");
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Test 1 - Responds with an object containing a 'comments' array", async () => {
    const response = await request(app)
      .get("/api/articles/1/comments")
      .expect(200);

    expect(response.body).toHaveProperty("comments");
    expect(typeof response.body).toBe("object");
    expect(Array.isArray(response.body.comments)).toBe(true);
  });
  test("200: Test 2 - Each item in 'comments' have properties named 'comment_id', 'votes', 'created_at, 'author', 'body', and 'article_id'", async () => {
    const response = await request(app)
      .get("/api/articles/1/comments")
      .expect(200);

    response.body.comments.forEach((comment) => {
      expect(comment).toHaveProperty("comment_id");
      expect(typeof comment.comment_id).toBe("number");
      expect(comment).toHaveProperty("votes");
      expect(typeof comment.votes).toBe("number");
      expect(comment).toHaveProperty("created_at");
      expect(typeof comment.created_at).toBe("string");
      expect(comment).toHaveProperty("author");
      expect(typeof comment.author).toBe("string");
      expect(comment).toHaveProperty("body");
      expect(typeof comment.body).toBe("string");
      expect(comment).toHaveProperty("article_id", 1);
      expect(typeof comment.article_id).toBe("number");
    });
  });
  test("200: Test 3 - The 'comments' items are sorted by date in descending order", async () => {
    const response = await request(app)
      .get("/api/articles/1/comments")
      .expect(200);
    const sortedArray = response.body.comments.toSorted(
      (a, b) => Date.parse(b.created_at) - Date.parse(a.created_at)
    );
    const expected = response.body.comments;

    expect(sortedArray).toEqual(expected);
  });
  test("200: Test 4 - The 'article_id' exists, but has no comments", async () => {
    const response = await request(app)
      .get("/api/articles/2/comments")
      .expect(200);
    expect(response.body.message).toBe("No comments yet");
  });
  test("400: Test 5 - The parametric endpoint 'article_id' is not a valid integer", async () => {
    const response = await request(app)
      .get("/api/articles/article1/comments")
      .expect(400);
    expect(response.body.message).toBe("Invalid article ID");
  });
  test("404: Test 6 - The parametric endpoint points to a non-existent 'article_id'", async () => {
    const response = await request(app)
      .get("/api/articles/9999/comments")
      .expect(404);
    expect(response.body.message).toBe("Article not found");
  });
});
