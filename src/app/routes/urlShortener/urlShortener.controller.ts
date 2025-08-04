import { Request, Response, NextFunction } from "express"
import { createShortUrl, getShortUrl } from "./urlShortener.service"
import AppError from "../../errors/AppError"
import httpStatus from "http-status"
import UrlShortener from "./urlShortener.model"

export const createShortUrlController = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const url = await createShortUrl(req.body)
        res.status(httpStatus.CREATED).json({
            success: true,
            message: "Short url created successfully",
            data: url
        })
    }catch(error){
        // Pass the error to the next middleware (global error handler)
        next(error);
    }
}

export const getShortUrlController = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const shortUrl = req.params.shortUrl
        const url = await getShortUrl(shortUrl)
        res.redirect(url.mainUrl)
    }catch(error){
        // Pass the error to the next middleware (global error handler)
        next(error);
    }
}

export const getAllShortURL = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const urls = await UrlShortener.find()
        res.status(httpStatus.OK).json({
            success: true,
            message: "All short urls fetched successfully",
            data: urls
        })
    }catch(error){
        next(error);
    }
}
