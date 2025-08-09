import AppError from "../../errors/AppError";
import { ICreateShortUrl, IInfo } from "./urlShortener.interface";
import shortid from "shortid";
import UrlShortener from "./urlShortener.model";
import httpStatus from "http-status";

//create short url
export const createShortUrl = async (payload: ICreateShortUrl) => {
  try {
    console.log("payload", payload)
    //generate short id
    const shortId = shortid.generate();
    if (!payload.mainUrl) {
      throw new AppError(400, "Main URL is required");
    }

    const urlExists = await UrlShortener.findOne({ mainUrl: payload.mainUrl });
    console.log("urlExists", urlExists)
    if (urlExists) {
      throw new AppError(400, "Url already exists");
    }
    const url = await UrlShortener.create({
      shortUrl: shortId,
      mainUrl: payload.mainUrl,
      totalClicks: 0,
      info: payload.info
    });
    console.log("url", url)
    return url;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(400, "Error creating short url");
  }
};

//get short url
export const getShortUrl = async (shortUrl: string, info: IInfo) => {
  try {
    const url = await UrlShortener.findOne({ shortUrl });
    if (!url) {
      throw new AppError(404, "Url not found");
    }
    url.totalClicks!++;
    url.info!.push(info);
    await url.save();
    return url;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(400, "Error getting short url");
  }
};
