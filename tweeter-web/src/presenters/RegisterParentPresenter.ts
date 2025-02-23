import { User, AuthToken } from "tweeter-shared";
import { View, Presenter } from "./Presenter";

export interface RegisterParentView extends View {
    updateUserInfo(user: User, user1: User, authToken: AuthToken, rememberMe: any): void;
    navigateTo:(url: string)=> void;
}
export abstract class RegisterParentPresenter extends Presenter {

    private _isLoading = false;

    protected constructor(view: RegisterParentView) {
        super(view)
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
    public abstract handleImageFile(file: File | undefined, setImageUrl:Function, setImageBytes:Function, setImageFileExtension:Function):void;

}