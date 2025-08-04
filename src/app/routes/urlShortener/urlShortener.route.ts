import { Router } from "express";
import { createShortUrlController } from "./urlShortener.controller";

const route = Router()

route.post("/create-short-url", createShortUrlController)

export default route
