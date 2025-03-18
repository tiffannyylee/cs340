import { MemoryRouter } from "react-router-dom"
import PostStatus from "../../../src/components/postStatus/PostStatus"
import {render, screen} from "@testing-library/react"
import React from "react"
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom"
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import {anything, capture, instance, mock, spy, verify, when} from "@typestrong/ts-mockito";
import { PostStatusPresenter } from "../../../src/presenters/PostStatusPresenter"
import useUserInfo from "../../../src/components/userInfo/UserInfoHook"
import { User, AuthToken } from "tweeter-shared"

library.add(fab);

jest.mock("../../../src/components/userInfo/UserInfoHook", () => ({
    ...jest.requireActual("../../../src/components/userInfo/UserInfoHook"),
    __esModule: true,
    default: jest.fn(),
  })); 

describe("PostStatus test", ()=>{
    let mockUserInstance: User;
    let mockAuthTokenInstance: AuthToken;
    beforeAll(()=>{
        const mockUser = mock<User>();
        const mockAuthToken = mock<AuthToken>();
        mockUserInstance = instance(mockUser);
        mockAuthTokenInstance = instance(mockAuthToken);
        (useUserInfo as jest.Mock).mockReturnValue({
            currentUser: mockUserInstance,
            authToken: mockAuthTokenInstance,
          }); 
    })

    it("When first rendered the Post Status and Clear buttons are both disabled.", ()=>{
        const {postStatusButton, clearButton} = renderPostStatusAndGetElements()
        expect(postStatusButton).toBeDisabled();
        expect(clearButton).toBeDisabled();
    })
    it("Both buttons are enabled when the text field has text.", async ()=>{
        const {postStatusButton, clearButton, user, postStatusField} = renderPostStatusAndGetElements()
        await user.type(postStatusField, "hello")
        expect(postStatusField).toHaveValue("hello")
        expect(postStatusButton).toBeEnabled();
        expect(clearButton).toBeEnabled();
    })
    it("Both buttons are disabled when the text field is cleared",async ()=> {
        const {postStatusButton, clearButton, user, postStatusField} = renderPostStatusAndGetElements()
        await user.type(postStatusField, "hello")
        expect(postStatusButton).toBeEnabled();
        expect(clearButton).toBeEnabled();

        // await user.clear(postStatusField)
        await user.click(clearButton)
        expect(postStatusButton).toBeDisabled();
        expect(clearButton).toBeDisabled();
    })
    it("The presenter's postStatus method is called with correct parameters when the Post Status button is pressed", async ()=>{
        const mockPresenter = mock<PostStatusPresenter>();
        const mockPresenterInstance = instance(mockPresenter);
        const currUser = mockUserInstance
        const auth = mockAuthTokenInstance

        const post = "new post"
        const {postStatusButton, user, postStatusField} = renderPostStatusAndGetElements(mockPresenterInstance)
        await user.type(postStatusField, post)
        await user.click(postStatusButton)
        verify(mockPresenter.submitPost(auth, currUser, post)).once();
    })
})

const renderPostStatus = (presenter?:PostStatusPresenter) => {
    return render(<MemoryRouter>
        {
            !!presenter ? (<PostStatus presenter = {presenter} />) : (<PostStatus />)
        }
    </MemoryRouter>);
}

const renderPostStatusAndGetElements = (presenter?: PostStatusPresenter) => {
    const user = userEvent.setup();

    renderPostStatus(presenter);
    const postStatusButton = screen.getByRole("button", {name : /Post Status/i})
    const clearButton = screen.getByRole("button", {name : /Clear/i})
    const postStatusField = screen.getByLabelText("postStatus")
    return {postStatusButton, clearButton, postStatusField, user}
}