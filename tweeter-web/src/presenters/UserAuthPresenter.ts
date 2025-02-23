import { User, AuthToken } from "tweeter-shared";
import { View, Presenter } from "./Presenter";

export interface UserAuthView extends View {
    updateUserInfo(user: User, user1: User, authToken: AuthToken, rememberMe: any): void;
    navigateTo:(url: string)=> void;
}
export abstract class UserAuthPresenter extends Presenter {

    private _isLoading = false;

    protected constructor(view: UserAuthView) {
        super(view)
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