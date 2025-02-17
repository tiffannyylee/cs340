import { UserService } from "../model/UserService";
import { UserAuthPresenter, UserAuthView } from "./UserAuthPresenter";

export class LoginPresenter extends UserAuthPresenter {
    private userService: UserService;
    public constructor(view: UserAuthView){
        super(view)
        this.userService=new UserService()
    }

    public checkSubmitButtonStatus(alias:string, password:string): boolean {
        return !alias || !password;
      };

    public async doLogin(alias:string, password:string, rememberMe: boolean, originalUrl: string) {
        try {
            this.isLoading=true;

            const [user, authToken] = await this.userService.login(alias, password);

            this.view.updateUserInfo(user, user, authToken, rememberMe);

            if (!!originalUrl) {
            this.view.navigateTo(originalUrl);
            } else {
            this.view.navigateTo("/");
            }
        } catch (error) {
            this.view.displayErrorMessage(
            `Failed to log user in because of exception: ${error}`
            );
        } finally {
            this.isLoading=false;
        }
    };
}