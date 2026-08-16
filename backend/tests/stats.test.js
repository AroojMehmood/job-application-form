const request = require("supertest");
const app = require("../app");

// Yeh sirf ek sanity check hai — confirm karta hai ke app + in-memory DB sahi connected hain
describe("GET /api/applications/stats", () => {
  it("returns success true with empty stats when no applications exist", async () => {
    const res = await request(app).get("/api/applications/stats");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.total).toBe(0);
  });
});