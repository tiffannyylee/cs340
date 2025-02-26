import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/UserService";
import { AppNavbarParentPresenter, AppNavbarView } from "./AppNavbarParentPresenter";

export class AppNavbarPresenter extends AppNavbarParentPresenter{
    private _userService: UserService | null = null
    public constructor(view:AppNavbarView){
        super(view)
        // this.userService = new UserService()
        // this._userService = this.userService;

    }
    protected get view():AppNavbarView {
      return super.view as AppNavbarView
    }
    public get userService(){
      if (this._userService == null){
        this._userService = new UserService()
      }
      return this._userService

    }
    public async logOut(authToken:AuthToken) {
        this.view.displayInfoMessage("Logging Out...", 0);
    
        try {
          await this.userService.logout(authToken!);
    
          this.view.clearLastInfoMessage();
          this.view.clearUserInfo();
        } catch (error) {
          this.view.displayErrorMessage(
            `Failed to log user out because of exception: ${(error as Error).message}`
          );
        }
      };
}