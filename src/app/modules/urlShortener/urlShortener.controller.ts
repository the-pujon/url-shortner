import { Request, Response, NextFunction } from "express"
import { createShortUrl, getShortUrl } from "./urlShortener.service"
import httpStatus from "http-status"
import UrlShortener from "./urlShortener.model"
import { parseUserAgent } from "./urlShortener.utils"

export const createShortUrlController = async (req: Request, res: Response, next: NextFunction) => {
    try{
       
        const userAgent = req.headers['user-agent'] || 'Unknown'
        
        // Parse user-agent to extract device, browser, and OS information
        const deviceInfo = parseUserAgent(userAgent)
        
        const infoData = {
            userAgent: userAgent,
            device: deviceInfo.device,
            browser: deviceInfo.browser,
            os: deviceInfo.os,
            timestamp: new Date().toISOString()
        }

        const url = await createShortUrl({...req.body, info: [infoData]})

        
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
        
        const userAgent = req.headers['user-agent'] || 'Unknown'
        
        // Parse user-agent to extract device, browser, and OS information
        const deviceInfo = parseUserAgent(userAgent)
        
        const infoData = {
            userAgent: userAgent,
            device: deviceInfo.device,
            browser: deviceInfo.browser,
            os: deviceInfo.os,
            timestamp: new Date().toISOString()
        }

        const url = await getShortUrl(shortUrl, infoData)
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


