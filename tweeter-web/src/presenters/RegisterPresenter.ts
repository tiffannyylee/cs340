import { UserService } from "../model/UserService";
import { RegisterParentPresenter, RegisterParentView } from "./RegisterParentPresenter";
import { UserAuthView } from "./UserAuthPresenter";

export class RegisterPresenter extends RegisterParentPresenter{
    private userService: UserService;
    public constructor(view: RegisterParentView){
        super(view)
        this.userService=new UserService()
    }

    public checkSubmitButtonStatus(firstName:string,lastName:string,alias:string,password:string,imageUrl:string,imageFileExtension:string):boolean{
        return (
          !firstName ||
          !lastName ||
          !alias ||
          !password ||
          !imageUrl ||
          !imageFileExtension
        );
      };

      public getFileExtension(file: File): string | undefined {
        return file.name.split(".").pop();
      };    

    public async doRegister(firstName:string,lastName:string,alias:string,password:string,imageBytes:Uint8Array,imageFileExtension:string,rememberMe:boolean) {
        try {
            this.isLoading=true;

            const [user, authToken] = await this.userService.register(
            firstName,
            lastName,
            alias,
            password,
            imageBytes,
            imageFileExtension
            );

            this.view.updateUserInfo(user, user, authToken, rememberMe);
            this.view.navigateTo("/");
        } catch (error) {
            this.view.displayErrorMessage(
            `Failed to register user because of exception: ${error}`
            );
        } finally {
            this.isLoading=false;
        }
      };

}