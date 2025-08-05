export interface ICreateShortUrl {
    shortUrl?: string,
    mainUrl: string,
    createdAt?: Date,
    updatedAt?: Date,
    totalClicks?: number,
    userAgent?: string,
    ipAddress?: string,
    referrer?: string,
    device?: string,
    browser?: string,
    os?: string,
    info?: IInfo[]
}

export interface IInfo {
    userAgent: string,
    device: string,
    browser: string,
    os: string,
    timestamp: string
}