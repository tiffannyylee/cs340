import { AuthToken } from "tweeter-shared"
import { MessageView, Presenter, View } from "./Presenter"

export interface AppNavbarView extends MessageView{
    clearUserInfo: () => void
}
export abstract class AppNavbarParentPresenter extends Presenter{
    protected constructor(view:AppNavbarView){
        super(view)
    }

    public abstract logOut(authToken:AuthToken):void;

}