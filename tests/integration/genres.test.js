let server;
const request = require("supertest");
const { Genres } = require("../../models/genresModel");

describe("/api/genres", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    server.close();
    await Genres.deleteMany();
  });

  describe("GET", () => {
    it("return all genres", async () => {
      await Genres.collection.insertMany([
        { gen: "genres1" },
        { gen: "genres2" },
        { gen: "genres3" }
      ]);
      const res = await request(server).get("/api/genres");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(3);
      expect(res.body.some(g => g.gen === "genres1")).toBeTruthy;
      expect(res.body.some(g => g.gen === "genres2")).toBeTruthy;
      expect(res.body.some(g => g.gen === "genres3")).toBeTruthy;
    });
  });
});
