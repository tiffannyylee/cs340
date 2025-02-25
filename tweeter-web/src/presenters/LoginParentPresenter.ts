import { UserAuthPresenter } from "./UserAuthPresenter";

export abstract class LoginParentPresenter extends UserAuthPresenter {

    public abstract doLogin(alias:string, password:string, rememberMe: boolean, originalUrl: string):void;

}