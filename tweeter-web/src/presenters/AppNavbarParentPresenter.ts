import { AuthToken } from "tweeter-shared"

export interface AppNavbarView{
    displayInfoMessage: (message: string, duration: number, bootstrapClasses?: string | undefined) => void
    displayErrorMessage: (message: string) => void
    clearLastInfoMessage: () => void
    clearUserInfo: () => void
}
export abstract class AppNavbarParentPresenter{
    private _view: AppNavbarView
    protected constructor(view:AppNavbarView){
        this._view = view
    }
    protected get view(){
        return this._view
    }
    public abstract logOut(authToken:AuthToken):void;

}