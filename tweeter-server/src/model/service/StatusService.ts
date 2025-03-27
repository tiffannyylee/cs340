import { StatusDto } from "tweeter-shared";
import { AuthToken, Status, FakeData } from "tweeter-shared";

export class StatusService{
    public async loadMoreFeedItems  (
        authToken: string,
        userAlias: string,
        pageSize: number,
        lastItem: StatusDto | null
      ): Promise<[StatusDto[], boolean]>  {
        // TODO: Replace with the result of calling server
        const [newItems, hasMore] = FakeData.instance.getPageOfStatuses(Status.fromDto(lastItem), pageSize);
        const dtos = newItems.map((status:Status)=>status.dto)
        return [dtos, hasMore]         
      };
    public async loadMoreStoryItems(
      authToken: string,
      userAlias: string,
      pageSize: number,
      lastItem: StatusDto | null
    ): Promise<[StatusDto[], boolean]> {
      // TODO: Replace with the result of calling server
      const [newItems, hasMore] = FakeData.instance.getPageOfStatuses(Status.fromDto(lastItem), pageSize);
      const dtos = newItems.map((status:Status)=>status.dto)
      return [dtos, hasMore]
    };

    public async getFeedOrStory(type: "feed" | "status", authToken: string, userAlias: string, pageSize:number, lastItem:StatusDto|null) {
      if (type == "feed"){
        return await this.loadMoreFeedItems(authToken,userAlias,pageSize,lastItem)
      } else {
        return await this.loadMoreStoryItems(authToken,userAlias,pageSize,lastItem)
      }
    }
    
    public async postStatus(
      authToken: string,
      newStatus: StatusDto
    ): Promise<void> {
      // Pause so we can see the logging out message. Remove when connected to the server
      await new Promise((f) => setTimeout(f, 2000));
      // TODO: Call the server to post the status
    };
}