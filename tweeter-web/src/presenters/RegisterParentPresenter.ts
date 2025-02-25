
import { UserAuthPresenter } from "./UserAuthPresenter";


export abstract class RegisterParentPresenter extends UserAuthPresenter {



    // public abstract checkSubmitButtonStatus(firstName:string,lastName:string,alias:string,password:string,imageUrl:string,imageFileExtension:string): boolean;
    public abstract doRegister(firstName:string,lastName:string,alias:string,password:string,imageBytes:Uint8Array,imageFileExtension:string,rememberMe:boolean):void;
    public abstract getFileExtension(file: File): string | undefined;
    public abstract handleImageFile(file: File | undefined, setImageUrl:Function, setImageBytes:Function, setImageFileExtension:Function):void;

}