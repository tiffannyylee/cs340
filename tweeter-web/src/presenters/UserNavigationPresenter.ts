import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/UserService";
import { UserNavParentPresenter, UserNavParentView } from "./UserNavParentPresenter";

export class UserNavigationPresenter extends UserNavParentPresenter{
    private userService: UserService;
    public constructor(view:UserNavParentView){
        super(view)
        this.userService = new UserService()
    }
    public extractAlias(value: string): string {
        const index = value.indexOf("@");
        return value.substring(index);
        };
    public async navigateToUser(event: React.MouseEvent): Promise<void> {
        event.preventDefault();
    
        try {
            const alias = this.extractAlias(event.target.toString());
            const authToken = this.view.getAuthToken();
      
        if (!authToken) {
            this.view.displayErrorMessage("No auth token found.");
            return;
        }
    
        const user =  await this.userService.getUser(authToken!, alias);

        if (!!user) {
            const currentUser = this.view.getCurrentUser()
            if (currentUser!.equals(user)) {
                this.view.setDisplayedUser(currentUser!);
            } else {
                this.view.setDisplayedUser(user);
            }
        }
        } catch (error) {
            this.view.displayErrorMessage(`Failed to get user because of exception: ${error}`);
        }
        };
}