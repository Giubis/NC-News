const app = require("../app");
const data = require("../db/data/test-data");
const db = require("../db/connection");
const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const { selectCommentsByArticleID } = require("../models/comments.model");
const jestSorting = require("jest-sorted");

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
    // const sortedArray = response.body.articles.toSorted(
    //   (a, b) => Date.parse(b.created_at) - Date.parse(a.created_at)
    // );
    // const expected = response.body.articles;

    // expect(sortedArray).toEqual(expected);
    expect(response.body.articles).toBeSortedBy("created_at", {
      descending: true,
    });
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
    // const sortedArray = response.body.comments.toSorted(
    //   (a, b) => Date.parse(b.created_at) - Date.parse(a.created_at)
    // );
    // const expected = response.body.comments;

    // expect(sortedArray).toEqual(expected);
    expect(response.body.comments).toBeSortedBy("created_at", {
      descending: true,
    });
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

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Test 1 - Adds the comment to the article and responds with the same comment", async () => {
    const comment = {
      username: "butter_bridge",
      body: "This is task 7!",
    };

    const response = await request(app)
      .post("/api/articles/3/comments")
      .send(comment)
      .expect(201);

    expect(response.body.comment).toHaveProperty("comment_id");
    expect(typeof response.body.comment.comment_id).toBe("number");
    expect(response.body.comment).toHaveProperty("article_id");
    expect(typeof response.body.comment.article_id).toBe("number");
    expect(response.body.comment.article_id).toBe(3);
    expect(response.body.comment).toHaveProperty("body");
    expect(typeof response.body.comment.body).toBe("string");
    expect(response.body.comment.body).toBe("This is task 7!");
    expect(response.body.comment).toHaveProperty("votes");
    expect(typeof response.body.comment.votes).toBe("number");
    expect(response.body.comment.votes).toBe(0);
    expect(response.body.comment).toHaveProperty("author");
    expect(typeof response.body.comment.author).toBe("string");
    expect(response.body.comment.author).toBe("butter_bridge");
    expect(response.body.comment).toHaveProperty("created_at");
    expect(typeof response.body.comment.created_at).toBe("string");
  });
  test("400: Test 2 - The request does not have a 'username' or a 'body', or both", async () => {
    const firstComment = {
      body: "No username",
    };

    const firstResponse = await request(app)
      .post("/api/articles/3/comments")
      .send(firstComment)
      .expect(400);

    const secondComment = {
      username: "No body",
    };

    const secondResponse = await request(app)
      .post("/api/articles/3/comments")
      .send(secondComment)
      .expect(400);

    const thirdComment = {};

    const thirdResponse = await request(app)
      .post("/api/articles/3/comments")
      .send(thirdComment)
      .expect(400);

    expect(firstResponse.body.message).toBe("Missing required fields");
    expect(secondResponse.body.message).toBe("Missing required fields");
    expect(thirdResponse.body.message).toBe("Missing required fields");
  });
  test("400: Test 3 - The parametric endpoint 'article_id' is not a valid integer", async () => {
    const comment = {
      username: "butter_bridge",
      body: "This is task 7!",
    };

    const response = await request(app)
      .post("/api/articles/article/comments")
      .send(comment)
      .expect(400);

    expect(response.body.message).toBe("Invalid article ID");
  });
  test("404: Test 4 - The parametric endpoint points to a non-existent 'article_id'", async () => {
    const comment = {
      username: "butter_bridge",
      body: "This is task 7!",
    };

    const response = await request(app)
      .post("/api/articles/9999/comments")
      .send(comment)
      .expect(404);

    expect(response.body.message).toBe("Article not found");
  });
  test("404: Test 5 - The request is made by a non-existent username", async () => {
    const comment = {
      username: "melted_bridge",
      body: "This is task 7!",
    };

    const response = await request(app)
      .post("/api/articles/3/comments")
      .send(comment)
      .expect(404);

    expect(response.body.message).toBe("User not found");
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("201: Test 1 - Responds with the updated article after having incremented or decremented its votes", async () => {
    const firstVote = {
      inc_votes: 1,
    };

    const firstResponse = await request(app)
      .patch("/api/articles/1")
      .send(firstVote)
      .expect(200);
    expect(firstResponse.body.article).toHaveProperty("author");
    expect(typeof firstResponse.body.article.author).toBe("string");
    expect(firstResponse.body.article).toHaveProperty("title");
    expect(typeof firstResponse.body.article.title).toBe("string");
    expect(firstResponse.body.article).toHaveProperty("article_id", 1);
    expect(typeof firstResponse.body.article.article_id).toBe("number");
    expect(firstResponse.body.article).toHaveProperty("body");
    expect(typeof firstResponse.body.article.body).toBe("string");
    expect(firstResponse.body.article).toHaveProperty("topic");
    expect(typeof firstResponse.body.article.topic).toBe("string");
    expect(firstResponse.body.article).toHaveProperty("created_at");
    expect(typeof firstResponse.body.article.created_at).toBe("string");
    expect(firstResponse.body.article).toHaveProperty("votes");
    expect(typeof firstResponse.body.article.votes).toBe("number");
    expect(firstResponse.body.article.votes).toBe(101);
    expect(firstResponse.body.article).toHaveProperty("article_img_url");
    expect(typeof firstResponse.body.article.article_img_url).toBe("string");

    const secondVote = {
      inc_votes: -100,
    };

    const secondResponse = await request(app)
      .patch("/api/articles/1")
      .send(secondVote)
      .expect(200);
    expect(secondResponse.body.article).toHaveProperty("author");
    expect(typeof secondResponse.body.article.author).toBe("string");
    expect(secondResponse.body.article).toHaveProperty("title");
    expect(typeof secondResponse.body.article.title).toBe("string");
    expect(secondResponse.body.article).toHaveProperty("article_id", 1);
    expect(typeof secondResponse.body.article.article_id).toBe("number");
    expect(secondResponse.body.article).toHaveProperty("body");
    expect(typeof secondResponse.body.article.body).toBe("string");
    expect(secondResponse.body.article).toHaveProperty("topic");
    expect(typeof secondResponse.body.article.topic).toBe("string");
    expect(secondResponse.body.article).toHaveProperty("created_at");
    expect(typeof secondResponse.body.article.created_at).toBe("string");
    expect(secondResponse.body.article).toHaveProperty("votes");
    expect(typeof secondResponse.body.article.votes).toBe("number");
    expect(secondResponse.body.article.votes).toBe(1);
    expect(secondResponse.body.article).toHaveProperty("article_img_url");
    expect(typeof secondResponse.body.article.article_img_url).toBe("string");
  });
  test("400: Test 2 - Responds with an error if the vote is not passed", async () => {
    const vote = {};

    const response = await request(app)
      .patch("/api/articles/1")
      .send(vote)
      .expect(400);
    expect(response.body.message).toBe("Missing vote");
  });
  test("400: Test 3 - Responds with an error if the vote is not an integer value, nor a whole number", async () => {
    const firstVote = { inc_votes: "One" };

    const firstResponse = await request(app)
      .patch("/api/articles/1")
      .send(firstVote)
      .expect(400);
    expect(firstResponse.body.message).toBe("The vote must be a valid number");

    const secondVote = { inc_votes: 1.5 };

    const secondResponse = await request(app)
      .patch("/api/articles/1")
      .send(secondVote)
      .expect(400);
    expect(secondResponse.body.message).toBe("The vote must be a valid number");
  });
  test("400: Test 4 - Responds with error if 'article_id' is not a number", async () => {
    const vote = { inc_votes: 1 };

    const response = await request(app)
      .patch("/api/articles/article")
      .send(vote)
      .expect(400);
    expect(response.body.message).toBe("Invalid article ID");
  });
  test("404: Test 5 - Responds with an error if 'article_id' does not exist", async () => {
    const vote = { inc_votes: 1 };

    const response = await request(app)
      .patch("/api/articles/9999")
      .send(vote)
      .expect(404);
    expect(response.body.message).toBe("Article not found");
  });
  test("422: Test 6 - Responds with error if the vote is zero", async () => {
    const vote = { inc_votes: 0 };

    const response = await request(app)
      .patch("/api/articles/1")
      .send(vote)
      .expect(422);

    expect(response.body.message).toBe(
      "The vote must be greater or lower than 0"
    );
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: Test 1 - Deletes the comment and receives a no-content response. It also double-checks that the comment is no longer present.", async () => {
    const response = await request(app).delete("/api/comments/1").expect(204);
    expect(response.body).toBeEmptyObject();

    const check = await selectCommentsByArticleID(9);
    expect(check).toHaveLength(1);
  });
  test("400: Test 2 - Responds with an error if the 'comment_id' is not an integer value", async () => {
    const response = await request(app)
      .delete("/api/comments/comment")
      .expect(400);
    expect(response.body.message).toBe("Invalid comment ID");
  });
  test("404: Test 3 - Responds with an error if the 'comment_id' does not exist", async () => {
    const response = await request(app)
      .delete("/api/comments/9999")
      .expect(404);
    expect(response.body.message).toBe("Comment not found");
  });
});
