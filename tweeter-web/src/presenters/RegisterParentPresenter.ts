import { User, AuthToken } from "tweeter-shared";

export interface RegisterParentView{
    updateUserInfo(user: User, user1: User, authToken: AuthToken, rememberMe: any): void;
    displayErrorMessage: (message: string) => void
    navigateTo:(url: string)=> void;
}
export abstract class RegisterParentPresenter {
    private _view: RegisterParentView

    private _isLoading = false;

    protected constructor(view: RegisterParentView) {
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

    public abstract checkSubmitButtonStatus(firstName:string,lastName:string,alias:string,password:string,imageUrl:string,imageFileExtension:string): boolean;
    public abstract doRegister(firstName:string,lastName:string,alias:string,password:string,imageBytes:Uint8Array,imageFileExtension:string,rememberMe:boolean):void;
    public abstract getFileExtension(file: File): string | undefined;

}