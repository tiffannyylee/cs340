import { MemoryRouter } from "react-router-dom"
import Login from "../../../../src/components/authentication/login/Login"
import {render, screen} from "@testing-library/react"
import React from "react"
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom"
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { LoginPresenter } from "../../../../src/presenters/LoginPresenter"
import {anything, capture, instance, mock, spy, verify, when} from "@typestrong/ts-mockito";

library.add(fab);

describe("Login Component", ()=>{
    it("start with the signin button disabled", ()=>{
        const {signInButton} = renderLoginAndGetElements("/")
        expect(signInButton).toBeDisabled();
    });

    it("The sign-in button is enabled when both the alias and password fields have text.", async ()=>{
        const {signInButton, aliasField, passwordField, user} = renderLoginAndGetElements("/")
        await user.type(aliasField, "a");
        await user.type(passwordField, "a");
        expect(signInButton).toBeEnabled();
    });
    it("disables signin button if either field is clear", async ()=>{
        const {signInButton, aliasField, passwordField, user} = renderLoginAndGetElements("/")
        await user.type(aliasField, "a");
        await user.type(passwordField, "a");
        expect(signInButton).toBeEnabled();

        await user.clear(aliasField);
        expect(signInButton).toBeDisabled();

        await user.type(aliasField, "b");
        expect(signInButton).toBeEnabled();

        await user.clear(passwordField);
        expect(signInButton).toBeDisabled();
    })
    it("The presenter's login method is called with correct parameters when the sign-in button is pressed.", async ()=>{
        const mockPresenter = mock<LoginPresenter>();
        const mockPresenterInstance = instance(mockPresenter);

        const originialUrl = "/login"
        const aliasText = "tiff"
        const passwordText = "password"
        const {signInButton, aliasField, passwordField, user} = renderLoginAndGetElements(originialUrl, mockPresenterInstance)

        await user.type(aliasField, aliasText)
        await user.type(passwordField, passwordText)

        await user.click(signInButton)

        verify(mockPresenter.doLogin(aliasText, passwordText,false, originialUrl)).once();
    })
})

const renderLogin = (originalUrl: string, presenter?: LoginPresenter) => {
    return render(<MemoryRouter>
        {
            !!presenter ? (<Login originalUrl={originalUrl} presenter = {presenter} />) : (<Login originalUrl={originalUrl} />)
        }
    </MemoryRouter>);
}

const renderLoginAndGetElements = (originalUrl:string, presenter?: LoginPresenter) => {
    const user = userEvent.setup();

    renderLogin(originalUrl, presenter);
    const signInButton = screen.getByRole("button", {name : /Sign in/i})
    const aliasField = screen.getByLabelText("alias")
    const passwordField = screen.getByLabelText("password")
    return {signInButton, aliasField, passwordField, user}
}