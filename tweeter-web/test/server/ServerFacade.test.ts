import { AuthToken, AuthTokenDto, FakeData, User, UserDto } from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade"
import "isomorphic-fetch"

describe("Server Facade Integration Tests", ()=>{
    let facade : ServerFacade;
    let authToken : AuthToken;
    let testUser: User;
    let fakeData: FakeData;

    beforeAll(async () => {
        facade = new ServerFacade();
    });

    test("Register new user", async ()=>{
        const firstName= "Tiffany";
        const lastName= "Lee";
        const alias="tifflee";
        const password= "password";
        const userImageBytes= "userimage";
        const imageFileExtension= "jpg";
        const request = {
            firstName:firstName,
            lastName:lastName,
            alias:alias,
            password:password,
            userImageBytes:userImageBytes,
            imageFileExtension:imageFileExtension
        }

        const [user, auth] = await facade.register(request)
        expect(user).toBeDefined();
        expect(user.alias).toBeDefined();
        expect(auth).toBeDefined();
        authToken = auth;
        testUser = user;
    })
    test("Get Followers of a User", async () => {
        const alias = testUser.alias; // Use registered user
        const request = {
            token: authToken.token,
            userAlias : alias,
            pageSize : 10,
            lastItem : null
        }
        const followers = await facade.getMoreFollowers(request);

        expect(Array.isArray(followers)).toBe(true);
        expect(followers.length).toBeGreaterThanOrEqual(0);
    });

    test("Get Following Count", async () => {
        const alias = testUser.alias;
        const request = {
            token: authToken.token,
            userAlias:alias
        }
        const followingCount = await facade.getFollowerCount(request);

        expect(typeof followingCount).toBe("number");
        expect(followingCount).toBeGreaterThanOrEqual(0);
    });

})