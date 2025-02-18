import { AuthToken, User } from "tweeter-shared"

export interface PostStatusView {
    displayInfoMessage: (message: string, duration: number, bootstrapClasses?: string | undefined) => void
    displayErrorMessage: (message: string) => void
    clearLastInfoMessage: () => void
    updatePost: (newPost: string) => void;
}
export abstract class PostStatusParentPresenter{
    private _view: PostStatusView
    protected _isLoading: boolean
    protected _post: string
    protected constructor(view:PostStatusView){
        this._view = view
        this._isLoading = false
        this._post = ""
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
    protected get post(){
        return this._post
    }
    protected set post(value:string){
        this._post = value
    }
    public abstract submitPost(authToken:AuthToken, currentUser:User, post:string):void;
    public abstract checkButtonStatus(post:string,authToken:AuthToken,currentUser:User):boolean|undefined;
}