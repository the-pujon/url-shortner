import { Request, Response, NextFunction } from "express"
import { createShortUrl } from "./urlShortener.service"
import AppError from "../../errors/AppError"
import httpStatus from "http-status"

export const createShortUrlController = async (req: Request, res: Response, next: NextFunction) => {
    try{
        await createShortUrl(req.body)
        res.status(httpStatus.CREATED).json({
            success: true,
            message: "Short url created successfully",
            data: []
        })
    }catch(error){
        // Pass the error to the next middleware (global error handler)
        next(error);
    }
}