import UrlShortener from "../../../../app/modules/urlShortener/urlShortener.model"
import { createShortUrl, getShortUrl } from "../../../../app/modules/urlShortener/urlShortener.service"

jest.mock("../../../../app/modules/urlShortener/urlShortener.model")

const mockUrlShortener = {
    mainUrl: "https://www.google898.com"
}

const mockInfo = {
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    device: "Desktop",
    browser: "Chrome",
    os: "Windows",
    timestamp: new Date().toISOString()
}

// Clear all mocks before each test
beforeEach(()=>{
    jest.clearAllMocks()
})

describe("Shorten URL", ()=>{
    describe("createShortUrl", ()=>{
        it("should create a short url", async ()=>{
            const mockFindOne = UrlShortener.findOne as jest.MockedFunction<typeof UrlShortener.findOne>
            mockFindOne.mockResolvedValue(null)
            // Mock create to return a created document
            const mockCreate = UrlShortener.create as jest.MockedFunction<typeof UrlShortener.create>
            mockCreate.mockResolvedValue({
                shortUrl: "abc123",
                mainUrl: mockUrlShortener.mainUrl,
                totalClicks: 0,
                info: [mockInfo]
            } as any)
            const result = await createShortUrl({...mockUrlShortener, info: [mockInfo]})
            console.log(result)
            // expect(result).toBeDefined()
            expect(result.mainUrl).toBe(mockUrlShortener.mainUrl)
            expect(result.shortUrl).toBeDefined()
            expect(result.totalClicks).toBe(0)
            expect(result.info).toBeDefined()
            expect(result.info?.length).toBe(1)
            expect(result.info?.[0].userAgent).toBe(mockInfo.userAgent)
    
        })

        it("should return an error if the url is already in the database", async ()=>{
            const mockDataInDB = {
                shortUrl: "abc123",
                mainUrl: "https://www.google.com",
                totalClicks: 0
            }
            const mockFindOne = UrlShortener.findOne as jest.MockedFunction<typeof UrlShortener.findOne>
            mockFindOne.mockResolvedValue(mockDataInDB)
            const mockCreate = UrlShortener.create as jest.MockedFunction<typeof UrlShortener.create>
            await expect(createShortUrl(mockUrlShortener)).rejects.toThrow("Url already exists")
            expect(mockCreate).not.toHaveBeenCalled()

        })

        it("should throw an error if the main url or request body is not provided", async ()=>{
            const emptyMockData = {
                mainUrl: ""
            }
            const mockFindOne = UrlShortener.findOne as jest.MockedFunction<typeof UrlShortener.findOne>
            const mockCreate = UrlShortener.create as jest.MockedFunction<typeof UrlShortener.create>
            await expect(createShortUrl(emptyMockData)).rejects.toThrow("Main URL is required")
            expect(mockFindOne).not.toHaveBeenCalled()
            expect(mockCreate).not.toHaveBeenCalled()
        })

        it("should throw an error if anything goes wrong", async () => {
            const mockFindOne = UrlShortener.findOne as jest.MockedFunction<typeof UrlShortener.findOne>
            const mockCreate = UrlShortener.create as jest.MockedFunction<typeof UrlShortener.create>
            mockFindOne.mockRejectedValue(new Error("Error finding url"))
            await expect(createShortUrl(mockUrlShortener)).rejects.toThrow("Error creating short url")
            expect(mockFindOne).toHaveBeenCalledWith({mainUrl: mockUrlShortener.mainUrl})
            expect(mockCreate).not.toHaveBeenCalled()
        })
    })

    describe("get short url", () =>{
        it("should redirect to the main url", async ()=>{
            const mockUrlShortener = {
                shortUrl: "abc123",
                mainUrl: "https://www.google.com", 
                totalClicks: 0,
                info: [mockInfo],
                save: jest.fn().mockResolvedValue(true)
            }
            const mockFindOne = UrlShortener.findOne as jest.MockedFunction<typeof UrlShortener.findOne>
            mockFindOne.mockResolvedValue(mockUrlShortener)
            const result = await getShortUrl(mockUrlShortener.shortUrl, mockInfo)
            expect(result).toEqual(mockUrlShortener)
            expect(mockFindOne).toHaveBeenCalledWith({shortUrl: mockUrlShortener.shortUrl})
            expect(mockUrlShortener.save).toHaveBeenCalled()
            expect(mockUrlShortener.totalClicks).toBe(1)
        })

        it("should throw error if url not found", async () => {
            const mockFindOne = UrlShortener.findOne as jest.MockedFunction<typeof UrlShortener.findOne>
            mockFindOne.mockResolvedValue(null)
            await expect(getShortUrl("abc123", mockInfo)).rejects.toThrow("Url not found")
        })

        it("should throw error if anything goes wrong", async () => {
            const mockFindOne = UrlShortener.findOne as jest.MockedFunction<typeof UrlShortener.findOne>
            mockFindOne.mockRejectedValue(new Error("Error finding url"))
            await expect(getShortUrl("abc123", mockInfo)).rejects.toThrow("Error getting short url")
        })
    })

    describe("get single short url analytics", () => {
        it("should return the single short url analytics", async () => {
            const mockUrlShortener = {
                shortUrl: "abc123",
                mainUrl: "https://www.google.com",
                totalClicks: 0,
                info: [mockInfo]
            }
        })
    })


})

