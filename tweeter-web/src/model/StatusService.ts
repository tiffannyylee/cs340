import { AuthToken, Status, FakeData } from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";
const server = new ServerFacade();

export class StatusService{
    public async loadMoreFeedItems  (
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: Status | null
      ): Promise<[Status[], boolean]>  {
        // TODO: Replace with the result of calling server
        const request = {
          token : authToken.token,
          userAlias : userAlias,
          pageSize : pageSize,
          lastItem : lastItem ? lastItem.dto : null
        }
        // return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
        return server.loadFeed(request)
      };
    public async loadMoreStoryItems(
      authToken: AuthToken,
      userAlias: string,
      pageSize: number,
      lastItem: Status | null
    ): Promise<[Status[], boolean]> {
      // TODO: Replace with the result of calling server
      const request = {
        token : authToken.token,
        userAlias : userAlias,
        pageSize : pageSize,
        lastItem : lastItem ? lastItem.dto : null
      }
      return server.loadStory(request);
    };
    public async postStatus(
      authToken: AuthToken,
      newStatus: Status
    ): Promise<void> {
      // Pause so we can see the logging out message. Remove when connected to the server
      //await new Promise((f) => setTimeout(f, 2000));
  
      // TODO: Call the server to post the status
      return server.postStory({token:authToken.token,newStatus:newStatus.dto})
    };
}