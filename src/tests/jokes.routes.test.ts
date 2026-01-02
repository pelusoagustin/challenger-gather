import request from "supertest";
import { createApp } from "../infrastructure/http/express/App";

jest.mock("../infrastructure/config/Logger", () => ({
  __esModule: true,
  default: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock(
  "../infrastructure/adapters/output/http/ChuckNorrisJokeProvider",
  () => {
    class ChuckNorrisJokeProvider {
      private counter = 0;

      async getRandomJoke(): Promise<string> {
        this.counter += 1;
        return `chuck-${this.counter}`;
      }
    }

    return { ChuckNorrisJokeProvider };
  }
);

jest.mock("../infrastructure/adapters/output/http/DadJokeProvider", () => {
  class DadJokeProvider {
    private counter = 0;

    async getRandomJoke(): Promise<string> {
      this.counter += 1;
      return `dad-${this.counter}`;
    }
  }

  return { DadJokeProvider };
});

jest.mock(
  "../infrastructure/adapters/output/persistence/MssqlJokeRepository",
  () => {
    class MssqlJokeRepository {
      private store = new Map<number, string>();
      private nextId = 1;

      async create(text: string): Promise<{ id: number; text: string }> {
        const id = this.nextId;
        this.nextId += 1;
        this.store.set(id, text);
        return { id, text };
      }

      async update(
        id: number,
        text: string
      ): Promise<{ id: number; text: string } | null> {
        if (!this.store.has(id)) {
          return null;
        }
        this.store.set(id, text);
        return { id, text };
      }

      async delete(id: number): Promise<boolean> {
        return this.store.delete(id);
      }
    }

    return { MssqlJokeRepository };
  }
);

describe("Jokes endpoints", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("GET /api/jokes returns a random joke", async () => {
    const app = createApp();
    const randomSpy = jest.spyOn(Math, "random").mockReturnValue(0.1);

    const response = await request(app).get("/api/jokes");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ joke: "chuck-1" });
    randomSpy.mockRestore();
  });

  test("GET /api/jokes/chuck returns Chuck joke", async () => {
    const app = createApp();
    const response = await request(app).get("/api/jokes/chuck");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ joke: "chuck-1" });
  });

  test("GET /api/jokes/dad returns Dad joke", async () => {
    const app = createApp();
    const response = await request(app).get("/api/jokes/dad");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ joke: "dad-1" });
  });

  test("GET /api/jokes/invalid returns 400", async () => {
    const app = createApp();
    const response = await request(app).get("/api/jokes/invalid");

    expect(response.status).toBe(400);
  });

  test("GET /api/jokes/paired returns 5 paired jokes", async () => {
    const app = createApp();
    const response = await request(app).get("/api/jokes/paired");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(5);
    for (let i = 0; i < 5; i += 1) {
      const index = i + 1;
      expect(response.body[i]).toMatchObject({
        chuck: `chuck-${index}`,
        dad: `dad-${index}`,
      });
      expect(response.body[i].combined).toEqual(
        expect.stringContaining(`chuck-${index}`)
      );
      expect(response.body[i].combined).toEqual(
        expect.stringContaining(`dad-${index}`)
      );
    }
  });

  test("GET /api/jokes/paired returns 502 on upstream error", async () => {
    const chuckModule = await import(
      "../infrastructure/adapters/output/http/ChuckNorrisJokeProvider"
    );
    const chuckSpy = jest
      .spyOn(chuckModule.ChuckNorrisJokeProvider.prototype, "getRandomJoke")
      .mockResolvedValueOnce("chuck-1")
      .mockResolvedValueOnce("chuck-2")
      .mockRejectedValueOnce(new Error("upstream"));

    const app = createApp();
    const response = await request(app).get("/api/jokes/paired");

    expect(response.status).toBe(502);
    chuckSpy.mockRestore();
  });

  test("POST /api/jokes stores a joke", async () => {
    const app = createApp();
    const response = await request(app)
      .post("/api/jokes")
      .send({ text: "hello" });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ id: 1, text: "hello" });
  });

  test("POST /api/jokes without text returns 400", async () => {
    const app = createApp();
    const response = await request(app).post("/api/jokes").send({});

    expect(response.status).toBe(400);
  });

  test("PUT /api/jokes/:number updates a joke", async () => {
    const app = createApp();
    const create = await request(app)
      .post("/api/jokes")
      .send({ text: "hello" });

    const response = await request(app)
      .put(`/api/jokes/${create.body.id}`)
      .send({ text: "updated" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: 1, text: "updated" });
  });

  test("PUT /api/jokes/:number with invalid id returns 400", async () => {
    const app = createApp();
    const response = await request(app)
      .put("/api/jokes/0")
      .send({ text: "updated" });

    expect(response.status).toBe(400);
  });

  test("PUT /api/jokes/:number with empty text returns 400", async () => {
    const app = createApp();
    const response = await request(app).put("/api/jokes/1").send({ text: "" });

    expect(response.status).toBe(400);
  });

  test("PUT /api/jokes/:number not found returns 404", async () => {
    const app = createApp();
    const response = await request(app)
      .put("/api/jokes/999")
      .send({ text: "updated" });

    expect(response.status).toBe(404);
  });

  test("DELETE /api/jokes/:number removes a joke", async () => {
    const app = createApp();
    const create = await request(app)
      .post("/api/jokes")
      .send({ text: "hello" });

    const response = await request(app).delete(`/api/jokes/${create.body.id}`);

    expect(response.status).toBe(204);
  });

  test("DELETE /api/jokes/:number not found returns 404", async () => {
    const app = createApp();
    const response = await request(app).delete("/api/jokes/999");

    expect(response.status).toBe(404);
  });
});
