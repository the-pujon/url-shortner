import { Request, Response } from "express"
import { createShortUrl } from "./urlShortener.service"
import AppError from "../../errors/AppError"

export const createShortUrlController = async (req: Request, res: Response) => {
    try{
        await createShortUrl(req.body)
        res.status(200).json({
            success: true,
            message: "Short url created successfully",
            data: []
        })
    }catch(error){
        throw new AppError(400, "Error creating short url")
    }
}