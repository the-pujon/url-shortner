import AppError from "../../errors/AppError"

export const createShortUrl = async (url: string, urlId: string, mainUrl:string) => {
    try{


    }catch(error){
        throw new AppError( 400 ,"Error creating short url")
    }

}