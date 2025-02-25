import { UserService } from "../model/UserService";
import { LoginParentPresenter, LoginParentView, } from "./LoginParentPresenter";


export class LoginPresenter extends LoginParentPresenter {
    private userService: UserService;
    public constructor(view: LoginParentView){
        super(view)
        this.userService=new UserService()
    }
    protected get view():LoginParentView {
        return super.view as LoginParentView
      }

    public checkSubmitButtonStatus(alias:string, password:string): boolean {
        return !alias || !password;
      };

    public async doLogin(alias:string, password:string, rememberMe: boolean, originalUrl: string) {
        this.doFailureReportingOperation(async()=>{
            this.isLoading=true;

            const [user, authToken] = await this.userService.login(alias, password);

            this.view.updateUserInfo(user, user, authToken, rememberMe);

            if (!!originalUrl) {
            this.view.navigateTo(originalUrl);
            } else {
            this.view.navigateTo("/");
            }
        }, "log user in")
        // try {
        //     this.isLoading=true;

        //     const [user, authToken] = await this.userService.login(alias, password);

        //     this.view.updateUserInfo(user, user, authToken, rememberMe);

        //     if (!!originalUrl) {
        //     this.view.navigateTo(originalUrl);
        //     } else {
        //     this.view.navigateTo("/");
        //     }
        // } catch (error) {
        //     this.view.displayErrorMessage(
        //     `Failed to log user in because of exception: ${error}`
        //     );
        // } finally {
            this.isLoading=false;
        //}
    };
}