import { AuthToken, Status, User } from "tweeter-shared";
import { Presenter, View } from "./Presenter";
export const PAGE_SIZE = 10;


export interface PagedItemView<T> extends View {
    addItems: (newItems: T []) => void
}

export abstract class PagedItemPresenter<T, U> extends Presenter {
    private _service: U;

    private _hasMoreItems = true;
    private _lastItem : T | null= null;

    public constructor(view:PagedItemView<T>){
        super(view)
        this._service = this.createService()
    }
    protected abstract createService():U;
    public get hasMoreItems() {
        return this._hasMoreItems
    }
    protected set hasMoreItems(value:boolean){
        this._hasMoreItems = value;
    }

    protected get lastItem() {
        return this._lastItem
    }
    protected set lastItem(item:T|null) {
        this._lastItem = item;
    }
    protected get service() {
        return this._service
    }
    protected get view() {
        return super.view as PagedItemView<T>
    }
    reset() {
        this.lastItem=null;
        this.hasMoreItems=true;
    }
    public async loadMoreItems(authToken: AuthToken, userAlias: string) {
        this.doFailureReportingOperation(async ()=>{
          const [newItems, hasMore] = await this.getMoreItems(
            authToken!,
            userAlias,
          );
    
          this.hasMoreItems = hasMore;
          this.lastItem = newItems[newItems.length - 1];
          this.view.addItems(newItems);
        }, 
        this.getItemDescription())
        };
    protected abstract getItemDescription(): string;
    protected abstract getMoreItems(authToken: AuthToken, userAlias: string): Promise<[T[], boolean]>;

    // public abstract loadMoreItems(authToken: AuthToken, userAlias: string) : void
}


