import { User, AuthToken } from "tweeter-shared";
import { Presenter, View } from "./Presenter";
import { UserService } from "../model/UserService";

export interface UserAuthView extends View {
    updateUserInfo(user: User, user1: User, authToken: AuthToken, rememberMe: any): void;
    navigateTo:(url: string)=> void;
}
export abstract class UserAuthPresenter extends Presenter {
    private _userService: UserService;

    private _isLoading = false;

    protected constructor(view: UserAuthView) {
        super(view)
        this._userService=new UserService()

    }
    protected get isLoading() {
        return this._isLoading
    }
    protected set isLoading(value:boolean) {
        this._isLoading = value;
    }
    protected get service() {
        return this._userService
    }
    public checkSubmitButtonStatus(...fields: string[]): boolean {
        return fields.some(field => !field);
    }
}