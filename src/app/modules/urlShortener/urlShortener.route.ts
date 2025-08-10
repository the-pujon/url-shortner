import { Router } from "express";
import { createShortUrlController, getAllShortURL, getShortUrlController, getSingleShortUrlAnalytics } from "./urlShortener.controller";

const route = Router()

route.post("/create-short-url", createShortUrlController)
route.get("/:shortUrl", getShortUrlController)
route.get("/analytics", getAllShortURL)
route.get("/analytics/:shortUrl", getSingleShortUrlAnalytics)

export default route
