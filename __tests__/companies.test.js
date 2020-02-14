process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../app");

beforeEach(function() {
  
});

// afterEach(function() {
//   // mske sure this *mutates*, not redefines, `cats`
//   //cats.length = 0;
// });

describe("GET /companies", function() {
  it("Gets a list of companies", async function() {
    const resp = await request(app).get(`/companies`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual(expect.any(Array));
  });
});

describe("GET /companies/apple", function() {
  it("Gets one company", async function() {
    const resp = await request(app).get(`/companies/apple`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual(expect.any(Object));
  });
});

describe("GET /companies/apple", function() {
  it("Gets one company", async function() {
    const resp = await request(app).get(`/companies/apple`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual(expect.any(Object));
  });
});