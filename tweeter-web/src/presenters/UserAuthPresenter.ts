import { User, AuthToken } from "tweeter-shared";

export interface UserAuthView {
    updateUserInfo(user: User, user1: User, authToken: AuthToken, rememberMe: any): void;
    displayErrorMessage: (message: string) => void
    navigateTo:(url: string)=> void;
}
export abstract class UserAuthPresenter {
    private _view: UserAuthView

    private _isLoading = false;

    protected constructor(view: UserAuthView) {
        this._view = view
    }
    protected get view() {
        return this._view
    }
    protected get isLoading() {
        return this._isLoading
    }
    protected set isLoading(value:boolean) {
        this._isLoading = value;
    }
    public abstract doLogin(alias:string, password:string, rememberMe: boolean, originalUrl: string):void;
    public abstract checkSubmitButtonStatus(alias:string, password:string): boolean;


}