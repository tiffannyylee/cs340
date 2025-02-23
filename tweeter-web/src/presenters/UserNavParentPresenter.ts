import { User, AuthToken } from "tweeter-shared";
import { View, Presenter } from "./Presenter";

export interface UserNavParentView extends View {
    setDisplayedUser(user: User): void;
    getCurrentUser(): User | null;
    getAuthToken(): AuthToken | null;
}
export abstract class UserNavParentPresenter extends Presenter {
    
    protected constructor(view:UserNavParentView){
        super(view) 
    }
    
    public abstract navigateToUser(event: React.MouseEvent): Promise<void>;
    public abstract extractAlias(value: string): string;
}