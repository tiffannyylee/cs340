import { UserService } from "../model/UserService";
import { RegisterParentPresenter, RegisterParentView } from "./RegisterParentPresenter";
import { Buffer } from "buffer";

export class RegisterPresenter extends RegisterParentPresenter{
    private userService: UserService;
    public constructor(view: RegisterParentView){
        super(view)
        this.userService=new UserService()
    }
    protected get view():RegisterParentView {
      return super.view as RegisterParentView
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

      public handleImageFile(file: File | undefined, setImageUrl:Function, setImageBytes:Function, setImageFileExtension:Function) {
        if (file) {
          setImageUrl(URL.createObjectURL(file));
    
          const reader = new FileReader();
          reader.onload = (event: ProgressEvent<FileReader>) => {
            const imageStringBase64 = event.target?.result as string;
    
            // Remove unnecessary file metadata from the start of the string.
            const imageStringBase64BufferContents =
              imageStringBase64.split("base64,")[1];
    
            const bytes: Uint8Array = Buffer.from(
              imageStringBase64BufferContents,
              "base64"
            );
    
            setImageBytes(bytes);
          };
          reader.readAsDataURL(file);
    
          // Set image file extension (and move to a separate method)
          const fileExtension = this.getFileExtension(file);
          if (fileExtension) {
            setImageFileExtension(fileExtension);
          }
        } else {
          setImageUrl("");
          setImageBytes(new Uint8Array());
        }
      };

}