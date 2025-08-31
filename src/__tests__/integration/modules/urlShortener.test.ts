import request from "supertest";
import mongoose from "mongoose";
import UrlShortener from "../../../app/modules/urlShortener/urlShortener.model";
import app from "../../../app";
import shortid from "shortid";


const mockInfo = {
  userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  device: "Desktop",
  browser: "Chrome",
  os: "Windows",
  timestamp: new Date().toISOString()
}

const mockResponseData = {
  success: true,
  message: "Short url created successfully",
  data: {
    shortUrl: "https://short.url/123456",
    mainUrl: "https://www.google.com",
    totalClicks: 0,
    info: [mockInfo]
  }
}

describe("URL Shortener Integration Test", () => {
  // test db setup
  // connect to db
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI as string);
  });

  // disconnect from db
  afterAll(async () => {
    await mongoose.disconnect();
  });

  // clear the db before each test
  beforeEach(async () => {
    const result = await UrlShortener.deleteMany({});
  });



  describe("POST create short url", () => {
    it("should create short url successfully", async () => {
      const testData = {
        mainUrl: "https://www.google.com",
      };

      const response = await request(app)
        .post("/api/v1/url-shortener/create-short-url")
        .set("User-Agent", mockInfo.userAgent)
        .send(testData)
        .expect(201);

      // Expect dynamic response shape and values rather than exact deep equality
      expect(response.body).toEqual(expect.objectContaining({
        success: true,
        message: "Short url created successfully",
        data: expect.objectContaining({
          shortUrl: expect.any(String),
          mainUrl: testData.mainUrl,
          totalClicks: 0,
          info: expect.arrayContaining([
            expect.objectContaining({
              userAgent: mockInfo.userAgent,
              device: mockInfo.device,
              browser: mockInfo.browser,
              os: mockInfo.os,
              timestamp: expect.any(String)
            })
          ])
        })
      }));

      const createdUrl = await UrlShortener.findOne({
        mainUrl: testData.mainUrl,
      });
      expect(createdUrl).toBeTruthy();
      expect(createdUrl?.mainUrl).toBe(testData.mainUrl);
      expect(createdUrl?.shortUrl).toBeDefined();
      expect(createdUrl?.totalClicks).toBe(0);
      expect(createdUrl?.createdAt).toBeDefined();
      expect(createdUrl?.updatedAt).toBeDefined();
    }, 10000); // 10 second timeout

    it("should return error if main url is not provided", async () => {
      const testData = {
        mainUrl: "",
      };

      const response = await request(app)
        .post("/api/v1/url-shortener/create-short-url")
        .send(testData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Main URL is required");
    }, 10000); // 10 second timeout


    it("should return error if main url already exists", async () => {
        const testData = {
            mainUrl: "https://www.google.com"
        }

        await UrlShortener.create({
            shortUrl: shortid.generate(),
            mainUrl: testData.mainUrl,
            totalClicks: 0
        })

        const response = await request(app)
        .post("/api/v1/url-shortener/create-short-url")
        .send(testData)
        .expect(400)

        expect(response.body.success).toBe(false)
        expect(response.body.message).toBe("Url already exists")
    })
  });
});
