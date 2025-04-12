import { AuthToken, AuthTokenDto, FakeData, LoadFeedOrStoryRequest, LoginRequest, User, UserDto } from "tweeter-shared";
import {PostStatusPresenter} from "../../src/presenters/PostStatusPresenter"
import {PostStatusView} from "../../src/presenters/PostStatusParentPresenter"
import { ServerFacade } from "../../network/ServerFacade"
import "isomorphic-fetch"
import {anything, capture, instance, mock, spy, verify, when} from "@typestrong/ts-mockito";
export {};

describe("Automated Integration Tests", ()=>{
    let mockView:PostStatusView
    let presenter: PostStatusPresenter;
    let server: ServerFacade;
    beforeEach(() => {
        mockView = mock<PostStatusView>();
        presenter = new PostStatusPresenter(instance(mockView));
        server = new ServerFacade();
     });

    it("Should verify when a user sends a status, the status is correctly appended to the user's story", async()=>{
        const loginReq:LoginRequest = {alias: "sethsundy", password: "seth"}
        const [user, auth]= await server.login(loginReq)
        await presenter.submitPost(auth, user, "this is my test post")
        verify(mockView.displayInfoMessage("Status posted!", 2000)).once();
        const loadStoryReq:LoadFeedOrStoryRequest = {token: auth.token,userAlias:user.alias,pageSize: 10,lastItem:null}
        const [userPost, hasMore] = await server.loadStory(loadStoryReq);
        expect(userPost.length).toBeGreaterThan(0);
        expect(userPost[0].post).toEqual("this is my test post");
        expect(userPost[0].user.alias).toEqual("@sethsundy");
    }, 15000)
})