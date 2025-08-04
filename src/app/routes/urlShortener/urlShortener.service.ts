import AppError from "../../errors/AppError"
import { ICreateShortUrl } from "./urlShortener.interface"
import shortid from "shortid"
import UrlShortener from "./urlShortener.model"
import httpStatus from "http-status"

export const createShortUrl = async (payload: ICreateShortUrl) => {
    try{
        const shortId = shortid.generate()
        if(!payload.mainUrl){
            throw new AppError(400, "Main URL is required")
        }

        const urlExists = await UrlShortener.findOne({mainUrl: payload.mainUrl})
        if(urlExists){
            throw new AppError(400, "Url already exists")
        }
        await UrlShortener.create({
            shortUrl: shortId,
            mainUrl: payload.mainUrl,
            totalClicks: 0
        })
        return null

    }catch(error){
        if(error instanceof AppError){
            throw error
        }
        throw new AppError(400, "Error creating short url")
    }

}