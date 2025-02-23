import { AuthToken, User } from "tweeter-shared"
import { View, Presenter, MessageView } from "./Presenter";

export interface PostStatusView extends MessageView {
    updatePost: (newPost: string) => void;
}
export abstract class PostStatusParentPresenter extends Presenter {
    protected _isLoading: boolean
    protected _post: string
    protected constructor(view:PostStatusView){
        super(view)
        this._isLoading = false
        this._post = ""
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