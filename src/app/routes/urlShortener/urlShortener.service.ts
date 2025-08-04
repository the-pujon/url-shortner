import AppError from "../../errors/AppError"
import { ICreateShortUrl } from "./urlShortener.interface"
import shortid from "shortid"
import UrlShortener from "./urlShortener.model"

export const createShortUrl = async (payload: ICreateShortUrl) => {
    try{
        const shortId = shortid.generate()

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
        throw new AppError( 400 ,"Error creating short url")
    }

}