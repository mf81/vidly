const request = require("supertest");
const { Genres } = require("../../models/genresModel");
const { Users } = require("../../models/usersModel");
const mongoose = require("mongoose");

describe("/api/genres", () => {
  let server;
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await Genres.deleteMany();
    await server.close();
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
      await Genres.deleteMany();
    });

    it("return genres by id", async () => {
      const genres = new Genres({ gen: "genres1" });
      await genres.save();

      const res = await request(server).get("/api/genres/" + genres._id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("gen", genres.gen);
    });

    it("return 404 by wrong ObjectId", async () => {
      const res = await request(server).get("/api/genres/1");

      expect(res.status).toBe(404);
    });

    it("return 404 if no genres with given id", async () => {
      const id = mongoose.Types.ObjectId();
      console.log("ID:", id);
      const res = await request(server).get("/api/genres/" + id);

      expect(res.status).toBe(404);
    });
  });

  describe("POST", () => {
    let token;
    let gen;

    const exec = async () => {
      return await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ gen });
    };

    beforeEach(() => {
      token = new Users().generateAuthToken();
    });

    it("return 401 unauth", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("return 400 gen be less then 3 char", async () => {
      gen = "12";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("return 400 gen more then 50 char", async () => {
      gen = new Array(52).join("x");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("save ganres in db if is valid", async () => {
      gen = "element";
      await exec();
      const genres = await Genres.find({ gen: "element" });
      expect(genres).not.toBeNull();
    });

    it("return ganres if is valid", async () => {
      gen = "element";
      const res = await exec();
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("gen", "element");
    });
  });
});
