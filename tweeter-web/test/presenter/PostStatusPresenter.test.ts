import {PostStatusPresenter} from "../../src/presenters/PostStatusPresenter"
import {PostStatusView} from "../../src/presenters/PostStatusParentPresenter"
import {anything, capture, instance, mock, spy, verify, when} from "@typestrong/ts-mockito";
import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../../src/model/StatusService";

describe("PostStatusPresenter", ()=>{
    let mockPostStatusPresenterView:PostStatusView;
    let postStatusPresenter:PostStatusPresenter;
    let mockStatusService:StatusService;

    const authToken = new AuthToken("abc", Date.now())
    const user = new User("tiffany", "lee", "tilee", "abcd");
    const status = new Status("new status", user!, Date.now())
    

    beforeEach(()=> {
        mockPostStatusPresenterView = mock <PostStatusView>();
        const mockPostStatusPresenterViewInstance = instance(mockPostStatusPresenterView);

        const postStatusPresenterSpy = spy(new PostStatusPresenter(mockPostStatusPresenterViewInstance));
        postStatusPresenter = instance(postStatusPresenterSpy);

        mockStatusService = mock<StatusService>();
        const mockStatusServiceInstance = instance(mockStatusService)

        when(postStatusPresenterSpy.statusService).thenReturn(mockStatusServiceInstance)
        
    }) 

    it("tells the view to display a posting status message", async ()=>{
        Object.defineProperty(postStatusPresenter, "isLoading", {
            set: jest.fn(()=>true)  // No-op setter
        });
        await postStatusPresenter.submitPost(authToken, user, "new post");
        verify(mockPostStatusPresenterView.displayInfoMessage("Posting status...", 0)).once();
    });

    it("calls postStatus on the post status service with the correct status string and auth token", async()=>{
        Object.defineProperty(postStatusPresenter, "isLoading", {
            get: jest.fn(() => true),  
            set: jest.fn(() => true)  
        });
        await postStatusPresenter.submitPost(authToken, user, "new status");
        let [capturedAuth, capturedStatus] = capture(mockStatusService.postStatus).last()
        expect(capturedAuth).toEqual(authToken);
        expect(capturedStatus.post).toEqual("new status");
        expect(capturedStatus.user).toEqual(user);
        expect(capturedStatus.timestamp).toBeDefined();
        verify(mockStatusService.postStatus(authToken,anything())).once()
    })
    it("When posting of the status is successful, the presenter tells the view to clear the last info message, clear the post, and display a status posted message", async ()=>{
        Object.defineProperty(postStatusPresenter, "isLoading", {
            get: jest.fn(),  
            set: jest.fn()  
        });
        await postStatusPresenter.submitPost(authToken, user, "new status");
        verify(mockPostStatusPresenterView.displayInfoMessage("Status posted!", 2000)).once();
        verify(mockPostStatusPresenterView.clearLastInfoMessage()).once()
        verify(mockPostStatusPresenterView.updatePost("")).once()
    })
    it("the presenter tells the view to display an error message and clear the last info message and does not tell it to clear the post or display a status posted message.", async ()=>{
        Object.defineProperty(postStatusPresenter, "isLoading", {
            get: jest.fn(),  
            set: jest.fn()  
        });
        const error = new Error("error submitting post")
        when(mockStatusService.postStatus).thenThrow(error)
        await postStatusPresenter.submitPost(authToken, user, "new status");
        verify(mockPostStatusPresenterView.displayErrorMessage(error.message));
        verify(mockPostStatusPresenterView.displayInfoMessage("Status posted!", 2000)).never();
        verify(mockPostStatusPresenterView.clearLastInfoMessage()).once()
        verify(mockPostStatusPresenterView.updatePost("")).never()
    })

})