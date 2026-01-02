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

describe("Math endpoints", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("GET /api/math/lcm returns LCM", async () => {
    const app = createApp();
    const response = await request(app).get("/api/math/lcm?numbers=4,6,8");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ lcm: 24 });
  });

  test("GET /api/math/increment returns incremented number", async () => {
    const app = createApp();
    const response = await request(app).get("/api/math/increment?number=5");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ result: 6 });
  });

  test("GET /api/math/lcm with invalid numbers returns 400", async () => {
    const app = createApp();
    const response = await request(app).get("/api/math/lcm?numbers=a,b");

    expect(response.status).toBe(400);
  });

  test("GET /api/math/lcm with empty numbers returns 400", async () => {
    const app = createApp();
    const response = await request(app).get("/api/math/lcm?numbers=");

    expect(response.status).toBe(400);
  });

  test("GET /api/math/lcm with spaces returns LCM", async () => {
    const app = createApp();
    const response = await request(app).get("/api/math/lcm?numbers=4, 6,8");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ lcm: 24 });
  });

  test("GET /api/math/lcm with zero returns 0", async () => {
    const app = createApp();
    const response = await request(app).get("/api/math/lcm?numbers=0,6");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ lcm: 0 });
  });

  test("GET /api/math/increment with invalid number returns 400", async () => {
    const app = createApp();
    const response = await request(app).get("/api/math/increment?number=abc");

    expect(response.status).toBe(400);
  });
});
