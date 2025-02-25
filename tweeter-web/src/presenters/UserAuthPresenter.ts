import { User, AuthToken } from "tweeter-shared";
import { Presenter, View } from "./Presenter";
import { UserService } from "../model/UserService";

export interface UserAuthView extends View {
    updateUserInfo(user: User, user1: User, authToken: AuthToken, rememberMe: any): void;
    navigateTo:(url: string)=> void;
}
export abstract class UserAuthPresenter extends Presenter {
    private _userService: UserService;
    protected constructor(view: UserAuthView) {
        super(view)
        this._userService=new UserService()

    }
    protected get service() {
        return this._userService
    }
    protected get view(){
        return super.view as UserAuthView
    }
    public checkSubmitButtonStatus(...fields: string[]): boolean {
        return fields.some(field => !field);
    }
    public async doLoadingAndAuthOperation(operation : () => Promise<void>, errorMessage: string) {

        this.doFailureReportingOperation(async()=>{
          this.isLoading=true;

            await operation();
        }, errorMessage)
            this.isLoading=false;
      };
}