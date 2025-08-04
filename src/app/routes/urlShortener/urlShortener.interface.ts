export interface ICreateShortUrl {
    shortUrl: string,
    mainUrl: string,
    createdAt?: Date,
    updatedAt?: Date,
    totalClicks?: number
}