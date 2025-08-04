import { Request, Response, NextFunction } from "express"
import { createShortUrl, getShortUrl } from "./urlShortener.service"
import AppError from "../../errors/AppError"
import httpStatus from "http-status"
import UrlShortener from "./urlShortener.model"

export const createShortUrlController = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const url = await createShortUrl(req.body)
        
        // Extract all available information from request
        const forwardedFor = req.headers['x-forwarded-for']
        const forwardedIp = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor
        const ipAddress = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || forwardedIp || 'Unknown'
        const referrer = req.headers.referer || req.headers.referrer || 'Direct'
        const userAgent = req.headers['user-agent'] || 'Unknown'
        
        // Parse user-agent to extract device, browser, and OS information
        const deviceInfo = parseUserAgent(userAgent)
        
        const infoData = {
            userAgent: userAgent,
            ipAddress: ipAddress,
            referrer: referrer,
            device: deviceInfo.device,
            browser: deviceInfo.browser,
            os: deviceInfo.os,
            timestamp: new Date().toISOString()
        }
        
        console.log('Request Information:', infoData)
        
        res.status(httpStatus.CREATED).json({
            success: true,
            message: "Short url created successfully",
            data: url,
            requestInfo: infoData
        })
    }catch(error){
        // Pass the error to the next middleware (global error handler)
        next(error);
    }
}

export const getShortUrlController = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const shortUrl = req.params.shortUrl
        
        // Extract all available information from request
        const forwardedFor = req.headers['x-forwarded-for']
        const forwardedIp = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor
        const ipAddress = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || forwardedIp || 'Unknown'
        const referrer = req.headers.referer || req.headers.referrer || 'Direct'
        const userAgent = req.headers['user-agent'] || 'Unknown'
        
        // Parse user-agent to extract device, browser, and OS information
        const deviceInfo = parseUserAgent(userAgent)
        
        
        const infoData = {
            userAgent: userAgent,
            ipAddress: ipAddress,
            referrer: referrer,
            device: deviceInfo.device,
            browser: deviceInfo.browser,
            os: deviceInfo.os,
            timestamp: new Date().toISOString()
        }
        
        console.log('Request Information:', infoData)
        
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
        
        // Extract all available information from request
        const forwardedFor = req.headers['x-forwarded-for']
        const forwardedIp = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor
        const ipAddress = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || forwardedIp || 'Unknown'
        const referrer = req.headers.referer || req.headers.referrer || 'Direct'
        const userAgent = req.headers['user-agent'] || 'Unknown'
        
        // Parse user-agent to extract device, browser, and OS information
        const deviceInfo = parseUserAgent(userAgent)
        
   
        
        const infoData = {
            userAgent: userAgent,
            ipAddress: ipAddress,
            referrer: referrer,
            device: deviceInfo.device,
            browser: deviceInfo.browser,
            os: deviceInfo.os,
            timestamp: new Date().toISOString()
        }

        console.log('Request Information:', infoData)
        
        res.status(httpStatus.OK).json({
            success: true,
            message: "All short urls fetched successfully",
            data: urls,
            requestInfo: infoData
        })
    }catch(error){
        next(error);
    }
}

// Helper function to parse user-agent string
const parseUserAgent = (userAgent: string) => {
    const ua = userAgent.toLowerCase()
    
    // Detect browser
    let browser = 'Unknown'
    if (ua.includes('chrome')) browser = 'Chrome'
    else if (ua.includes('firefox')) browser = 'Firefox'
    else if (ua.includes('safari')) browser = 'Safari'
    else if (ua.includes('edge')) browser = 'Edge'
    else if (ua.includes('opera')) browser = 'Opera'
    else if (ua.includes('ie')) browser = 'Internet Explorer'
    
    // Detect OS
    let os = 'Unknown'
    if (ua.includes('windows')) os = 'Windows'
    else if (ua.includes('mac')) os = 'macOS'
    else if (ua.includes('linux')) os = 'Linux'
    else if (ua.includes('android')) os = 'Android'
    else if (ua.includes('ios')) os = 'iOS'
    
    // Detect device type
    let device = 'Desktop'
    if (ua.includes('mobile')) device = 'Mobile'
    else if (ua.includes('tablet')) device = 'Tablet'
    else if (ua.includes('android') || ua.includes('ios')) device = 'Mobile'
    
    return { browser, os, device }
}


