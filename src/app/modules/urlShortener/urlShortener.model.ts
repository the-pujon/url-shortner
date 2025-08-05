import { model, Schema } from "mongoose";
import { ICreateShortUrl, IInfo } from "./urlShortener.interface";

const infoSchema = new Schema<IInfo>({
    userAgent: {
        type: String,
        required: true
    },
    device: {
        type: String,
        required: true
    },
    browser: {
        type: String,
        required: true
    },
    os: {
        type: String,
        required: true
    },
    timestamp: {
        type: String,
        required: true,
        default: new Date().toISOString()
    }
})

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
    },
    info: {
        type: [infoSchema],
        required: true
    }
}, { timestamps: true })

const UrlShortener = model<ICreateShortUrl>("UrlShortener", urlShortenerSchema)

export default UrlShortener