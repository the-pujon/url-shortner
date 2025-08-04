import { Router } from "express";
import { createShortUrlController, getAllShortURL, getShortUrlController } from "./urlShortener.controller";

const route = Router()

route.post("/create-short-url", createShortUrlController)
route.get("/:shortUrl", getShortUrlController)
route.get("/", getAllShortURL)

export default route
