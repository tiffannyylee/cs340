import { UserService } from "../model/UserService";
import { RegisterParentPresenter } from "./RegisterParentPresenter";
import { Buffer } from "buffer";
import { UserAuthView } from "./UserAuthPresenter";

export class RegisterPresenter extends RegisterParentPresenter{
    public constructor(view: UserAuthView){
        super(view)
    }
    protected get view():UserAuthView {
      return super.view as UserAuthView
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

    public async doRegister(firstName:string,lastName:string,alias:string,password:string,imageBytes:Uint8Array,imageFileExtension:string,rememberMe:boolean) {
        this.doFailureReportingOperation(async()=>{
          this.isLoading=true;

            const [user, authToken] = await this.service.register(
            firstName,
            lastName,
            alias,
            password,
            imageBytes,
            imageFileExtension
            );

            this.view.updateUserInfo(user, user, authToken, rememberMe);
            this.view.navigateTo("/");
        }, "register user")
            this.isLoading=false;

      };
      public getFileExtension(file: File): string | undefined {
        return file.name.split(".").pop();
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