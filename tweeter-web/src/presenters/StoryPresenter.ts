import { AuthToken, Status } from "tweeter-shared";
import { StatusService } from "../model/StatusService";
import { StatusItemPresenter, StatusItemView } from "./StatusItemPresenter";
import { PAGE_SIZE } from "./PagedItemPresenter";

export class StoryPresenter extends StatusItemPresenter{
    protected getItemDescription(): string {
        return "load story items"
    }
    protected getMoreItems(authToken: AuthToken, userAlias: string): Promise<[Status[], boolean]> {
        return this.service.loadMoreStoryItems (
            authToken!,
            userAlias,
            PAGE_SIZE,
            this.lastItem
        );
    }


    // public async loadMoreItems(authToken: AuthToken, userAlias: string)  {
    //     this.doFailureReportingOperation(async ()=>{
    //         const [newItems, hasMore] = await this.statusService.loadMoreStoryItems (
    //             authToken!,
    //             userAlias,
    //             PAGE_SIZE,
    //             this.lastItem
    //         );
    
    //         this.hasMoreItems=hasMore;
    //         this.lastItem = newItems[newItems.length - 1];
    //         this.view.addItems(newItems);
    //     }, "load story items")
    // };
}