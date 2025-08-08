export interface ICreateShortUrl {
    shortUrl?: string,
    mainUrl: string,
    createdAt?: Date,
    updatedAt?: Date,
    totalClicks?: number,
    info?: IInfo[]
}

export interface IInfo {
    userAgent: string,
    device: string,
    browser: string,
    os: string,
    timestamp: string
}