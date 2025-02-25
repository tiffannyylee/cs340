import { User, AuthToken } from "tweeter-shared";
import { View, Presenter } from "./Presenter";
import { UserAuthPresenter } from "./UserAuthPresenter";

// export interface LoginParentView extends View {
//     updateUserInfo(user: User, user1: User, authToken: AuthToken, rememberMe: any): void;
//     navigateTo:(url: string)=> void;
// }
export abstract class LoginParentPresenter extends UserAuthPresenter {

    // private _isLoading = false;

    // protected constructor(view: LoginParentView) {
    //     super(view)
    // }
    // protected get isLoading() {
    //     return this._isLoading
    // }
    // protected set isLoading(value:boolean) {
    //     this._isLoading = value;
    // }
    public abstract doLogin(alias:string, password:string, rememberMe: boolean, originalUrl: string):void;
    // public abstract checkSubmitButtonStatus(alias:string, password:string): boolean;


}