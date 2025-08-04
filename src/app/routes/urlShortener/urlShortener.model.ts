import { model, Schema } from "mongoose";
import { ICreateShortUrl } from "./urlShortener.interface";

const urlShortenerSchema = new Schema<ICreateShortUrl>({
    shortUrl: {
        type: String,
        required: true,
        unique: true
    },
    mainUrl: {
        type: String,
        required: true,
        unique: true
    },
    totalClicks: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

const UrlShortener = model<ICreateShortUrl>("UrlShortener", urlShortenerSchema)

export default UrlShortener