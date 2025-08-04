import UrlShortener from "../../../../app/routes/urlShortener/urlShortener.model"
import { createShortUrl } from "../../../../app/routes/urlShortener/urlShortener.service"

jest.mock("../../../../app/routes/urlShortener/urlShortener.model")

const mockUrlShortener = {
    mainUrl: "https://www.google.com"
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
            const result = await createShortUrl(mockUrlShortener)
            expect(result).toBeNull()
    
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
            const mockError = new Error("Error creating short url")
            await expect(createShortUrl(mockUrlShortener)).rejects.toThrow(mockError)
            expect(mockFindOne).toHaveBeenCalledWith({mainUrl: mockUrlShortener.mainUrl})
            expect(mockCreate).not.toHaveBeenCalled()
        })
    })


})

