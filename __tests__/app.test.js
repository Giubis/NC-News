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
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an object containing a 'topics' array", async () => {
    const response = await request(app).get("/api/topics").expect(200);

    expect(response.body).toHaveProperty("topics");
    expect(Array.isArray(response.body.topics)).toBe(true);

    response.body.topics.forEach((topic) => {
      expect(topic).toHaveProperty("slug");
      expect(typeof topic.slug).toBe("string");
      expect(topic).toHaveProperty("description");
      expect(typeof topic.description).toBe("string");
    });
  });
});
