import { LoginParentPresenter, } from "./LoginParentPresenter";
import { UserAuthView } from "./UserAuthPresenter";


export class LoginPresenter extends LoginParentPresenter {
    public constructor(view: UserAuthView){
        super(view)
    }
    protected get view():UserAuthView {
        return super.view as UserAuthView
      }

    public async doLogin(alias:string, password:string, rememberMe: boolean, originalUrl: string) {
        this.doLoadingAndAuthOperation(async ()=>{
            const [user, authToken] = await this.service.login(alias, password);
            this.view.updateUserInfo(user, user, authToken, rememberMe);
            if (!!originalUrl) {
            this.view.navigateTo(originalUrl);
            } else {
            this.view.navigateTo("/");
            }
        },"log user in")
            // this.isLoading=false;
    };
}