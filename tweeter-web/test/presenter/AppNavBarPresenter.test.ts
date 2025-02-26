import { AppNavbarPresenter } from "../../src/presenters/AppNavbarPresenter"
import { AppNavbarView } from "../../src/presenters/AppNavbarParentPresenter";
import {anything, capture, instance, mock, spy, verify, when} from "@typestrong/ts-mockito";
import { AuthToken } from "tweeter-shared";
import { UserService } from "../../src/model/UserService";

describe("AppNavBarPresenter", ()=>{
    let mockAppNavbarPresenterView:AppNavbarView;
    let appNavbarPresenter:AppNavbarPresenter;
    let mockUserService:UserService;

    const authToken = new AuthToken("abc", Date.now())

    beforeEach(()=> {
        mockAppNavbarPresenterView = mock <AppNavbarView>();
        const mockAppNavbarPresenterViewInstance = instance(mockAppNavbarPresenterView);

        const appNavbarPresenterSpy = spy(new AppNavbarPresenter(mockAppNavbarPresenterViewInstance));
        appNavbarPresenter = instance(appNavbarPresenterSpy);

        mockUserService = mock<UserService>();
        const mockUserServiceInstance = instance(mockUserService)

        when(appNavbarPresenterSpy.userService).thenReturn(mockUserServiceInstance)
    }) 

    it("tells the view to display the login message", async ()=>{
        await appNavbarPresenter.logOut(authToken)
        verify(mockAppNavbarPresenterView.displayInfoMessage("Logging Out...", 0)).once()
    });

    it("calls logout on user service with the correct authToken", async ()=>{
        await appNavbarPresenter.logOut(authToken);
        verify(mockUserService.logout(authToken)).once();

        // let [captureAuthToken] = capture(mockUserService.logout).last();
        // expect(captureAuthToken).toEqual(authToken)
    })

    it("tells the view to clear the last info message and clear the user info when logout is successful", async ()=>{
        await appNavbarPresenter.logOut(authToken);
        verify(mockAppNavbarPresenterView.clearLastInfoMessage()).once();
        verify(mockAppNavbarPresenterView.clearUserInfo()).once();

        verify(mockAppNavbarPresenterView.displayErrorMessage(anything())).never()

    })

    it("tells the view to display an error message and does not tell it to clear the last info message or clear the user info when logout is unsuccessful", async ()=>{
        const error = new Error("logout error occurred")
        when(mockUserService.logout(authToken)).thenThrow(error)
        
        await appNavbarPresenter.logOut(authToken);
        verify(mockAppNavbarPresenterView.displayErrorMessage(`Failed to log user out because of exception: logout error occurred`)).once()
        verify(mockAppNavbarPresenterView.clearLastInfoMessage()).never();
        verify(mockAppNavbarPresenterView.clearUserInfo()).never();


    })
});
