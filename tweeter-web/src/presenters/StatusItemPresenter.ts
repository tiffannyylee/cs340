import { AuthToken, Status } from "tweeter-shared";
import { Presenter, View } from "./Presenter";

export interface StatusItemView extends View{
    addItems:(newItems: Status []) => void
    //functions from the component that the view will call on the presenter
}
export abstract class StatusItemPresenter extends Presenter{
    private _hasMoreItems = true;
    private _lastItem : Status | null= null;
    
    protected constructor(view: StatusItemView) {
        super(view)
    }

    public get hasMoreItems() {
        return this._hasMoreItems
    }
    protected set hasMoreItems(value:boolean){
        this._hasMoreItems = value;
    }

    protected get lastItem() {
        return this._lastItem
    }
    protected set lastItem(item:Status|null) {
        this._lastItem = item;
    }
    reset() {
        this.lastItem=null;
        this.hasMoreItems=true;
    }
    public abstract loadMoreItems(authToken: AuthToken, userAlias: string) : void;
}