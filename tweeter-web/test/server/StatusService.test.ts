import { StatusService } from "../../src/model/StatusService";
import { AuthToken, Status } from "tweeter-shared";
import "isomorphic-fetch"

describe("StatusService Integration Test", () => {
    let statusService: StatusService;

    beforeEach(() => {
        statusService = new StatusService(); 
    });

    test("should successfully retrieve a user's story from the server", async () => {
        // Sample input
        const authToken = new AuthToken("1234", 1234);
        const userAlias = "@tiffany";
        const pageSize = 3;
        const lastItem: Status | null = null; 
        const request = {
            token : authToken,
            userAlias: userAlias,
            pageSize: pageSize,
            lastItem: null
        }
        const [statuses, hasMore] = await statusService.loadMoreStoryItems(authToken,userAlias,pageSize,lastItem);

        expect(Array.isArray(statuses)).toBe(true);
        expect(statuses.length).toBeGreaterThanOrEqual(0); 
        expect(typeof hasMore).toBe("boolean");

        
    }, 10000); 
});
