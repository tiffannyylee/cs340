import { AuthToken, User } from "tweeter-shared"

export interface UserInfoView {
    displayInfoMessage: (message: string, duration: number, bootstrapClasses?: string | undefined) => void
    displayErrorMessage: (message: string) => void
    clearLastInfoMessage: () => void

}
export abstract class UserInfoParentPresenter {
    private _view:UserInfoView
    protected _isLoading: boolean
    protected _isFollower: boolean
    protected _followeeCount: number
    protected _followerCount: number
    protected constructor(view:UserInfoView){
        this._view = view
        this._isLoading = false
        this._isFollower = false
        this._followeeCount = -1
        this._followerCount = -1
    }
    protected get view() {
        return this._view
    }
    protected get isLoading(){
        return this._isLoading
    }
    protected set isLoading(value:boolean){
        this._isLoading = value
    }
    protected get isFollower(){
        return this._isFollower
    }
    protected set isFollower(value:boolean){
        this._isFollower = value
    }
    protected get followeeCount(){
        return this._followeeCount
    }
    protected set followeeCount(value:number){
        this._followeeCount = value
    }
    protected get followerCount(){
        return this._followerCount
    }
    protected set followerCount(value:number){
        this._followerCount = value
    }
    public abstract setIsFollowerStatus(
        authToken: AuthToken,
        currentUser: User,
        displayedUser: User,
        setIsFollower: Function
      ) : void;

    public abstract setNumbFollowees (
        authToken: AuthToken,
        displayedUser: User,
        setFolloweeCount: Function
    ): void;
    public abstract setNumbFollowers (
        authToken: AuthToken,
        displayedUser: User,
        setFollowerCount: Function
      ): void;
    public abstract followDisplayedUser (
        event: React.MouseEvent,
        displayedUser:User,
        authToken:AuthToken,
        setIsFollower: Function, 
        setFollowerCount: Function, 
        setFolloweeCount: Function
    ): Promise<void>;
    public abstract unfollowDisplayedUser (
        event: React.MouseEvent,
        displayedUser:User,
        authToken:AuthToken,
        setIsFollower: Function, 
        setFollowerCount: Function, 
        setFolloweeCount: Function
    ): Promise<void> 
}