import { User, AuthToken } from "tweeter-shared";

export interface UserNavParentView {
    displayErrorMessage: (message: string) => void
    setDisplayedUser(user: User): void;
    getCurrentUser(): User | null;
    getAuthToken(): AuthToken | null;
}
export abstract class UserNavParentPresenter {
    private _view: UserNavParentView;
    
    protected constructor(view:UserNavParentView){
        this._view = view 
    }
    public get view() {
        return this._view
    }
    
    public abstract navigateToUser(event: React.MouseEvent): Promise<void>;
    public abstract extractAlias(value: string): string;
}