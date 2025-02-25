import { AuthToken, Status } from "tweeter-shared";
import {  StatusItemPresenter, StatusItemView } from "./StatusItemPresenter";
import { PAGE_SIZE } from "./PagedItemPresenter";


export class FeedPresenter extends StatusItemPresenter{
    protected getItemDescription(): string {
        return "load feed items"
    }
    protected getMoreItems(authToken: AuthToken, userAlias: string): Promise<[Status[], boolean]> {
        return this.service.loadMoreFeedItems (
            authToken!,
            userAlias,
            PAGE_SIZE,
            this.lastItem
        );
    }

    // public constructor (view: StatusItemView) {
    //     super(view)
    // }
    // protected get view():StatusItemView {
    //     return super.view as StatusItemView
    //   }
    // public async loadMoreItems(authToken: AuthToken, userAlias: string)  {
    //     this.doFailureReportingOperation(async ()=>{
    //         const [newItems, hasMore] = await this.service.loadMoreFeedItems (
    //             authToken!,
    //             userAlias,
    //             PAGE_SIZE,
    //             this.lastItem
    //         );
    
    //         this.hasMoreItems=hasMore;
    //         this.lastItem = newItems[newItems.length - 1];
    //         this.view.addItems(newItems);
    //     }, "load feed items")
    // };
}