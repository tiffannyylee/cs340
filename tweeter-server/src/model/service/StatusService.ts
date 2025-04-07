import { StatusDto, UserDto } from "tweeter-shared";
import { AuthToken, Status, FakeData } from "tweeter-shared";
import { DaoFactory } from "../../dataAccess/factory/DaoFactory";
import { FollowsDao } from "../../dataAccess/FollowsDao";
import { S3Dao } from "../../dataAccess/S3Dao";
import { UserDao } from "../../dataAccess/UserDao";
import { StatusDao } from "../../dataAccess/StatusDao";

export class StatusService{
  private followDao : FollowsDao;
  private userDao : UserDao;
  private s3Dao : S3Dao;
  private statusDao: StatusDao;
  constructor(daoFactory : DaoFactory){
    this.followDao = daoFactory.createFollowsDao();
    this.userDao = daoFactory.createUserDao();
    this.s3Dao = daoFactory.createS3Dao();
    this.statusDao = daoFactory.createStatusDao();
  }
    private async loadMoreStatusItems ( tableName: "feed"|"story", keyName:string, userAlias: string,
      pageSize: number,
      lastItem: StatusDto | null): Promise<[StatusDto[], boolean]> {
        const [rawStatuses, hasMore] = await this.statusDao.getStatus(tableName, keyName, userAlias, pageSize, lastItem ?? undefined);

        const aliases = [...new Set(rawStatuses.map((s) => s.author_handle))];
        const users = await this.userDao.batchGetUsersByAliases(aliases);
        const userMap = new Map<string, UserDto>(users.map((u): [string, UserDto] => [u.alias, u]));
        const statuses: StatusDto[] = rawStatuses.map((s) => {
          return {post : s.post,
          user : userMap.get(s.author_handle)!,
          timestamp : s.timestamp
        } as StatusDto
      });
        if (statuses.length == 0) {
          return [[],hasMore]
        }
        return [statuses, hasMore]  
      }

    public async loadMoreFeedItems  (
        authToken: string,
        userAlias: string,
        pageSize: number,
        lastItem: StatusDto | null
      ): Promise<[StatusDto[], boolean]>  {
        // TODO: Replace with the result of calling server
        const [rawStatuses, hasMore] = await this.statusDao.getStatus("feed", "user_handle", userAlias, pageSize, lastItem ?? undefined);

        const aliases = [...new Set(rawStatuses.map((s) => s.author_handle))];
        const users = await this.userDao.batchGetUsersByAliases(aliases);
        const userMap = new Map<string, UserDto>(users.map((u): [string, UserDto] => [u.alias, u]));
        const statuses: StatusDto[] = rawStatuses.map((s) => {
          return {post : s.post,
          user : userMap.get(s.author_handle)!,
          timestamp : s.timestamp
        } as StatusDto
      });
        if (statuses.length == 0) {
          return [[],hasMore]
        }
        return [statuses, hasMore]      
      };
    public async loadMoreStoryItems(
      authToken: string,
      userAlias: string,
      pageSize: number,
      lastItem: StatusDto | null
    ): Promise<[StatusDto[], boolean]> {
      // TODO: Replace with the result of calling server
      // const [newItems, hasMore] = FakeData.instance.getPageOfStatuses(Status.fromDto(lastItem), pageSize);
      // const dtos = newItems.map((status:Status)=>status.dto)
      // return [dtos, hasMore]
      return await this.loadMoreStatusItems("story", "author_handle", userAlias, pageSize, lastItem)

    };

    public async getFeedOrStory(type: "feed" | "status", authToken: string, userAlias: string, pageSize:number, lastItem:StatusDto|null) {
      if (type == "feed"){
        return await this.loadMoreFeedItems(authToken,userAlias,pageSize,lastItem)
      } else {
        return await this.loadMoreStoryItems(authToken,userAlias,pageSize,lastItem)
      }
    }
    
    public async postStatus(
      token: string,
      newStatus: StatusDto
    ): Promise<void> {
      // Pause so we can see the logging out message. Remove when connected to the server
      //await new Promise((f) => setTimeout(f, 2000));
      // TODO: Call the server to post the status
      //send as dto
      //add to story table for user
      //go to feed
      const {authToken, handle} = await this.getAuthFromQuery(token)
      await this.statusDao.postStatusToStory(newStatus)
      //this gets all followers of the user whos token was passed in
      const followers = await this.followDao.getAllFollowers(handle)
      console.log(`Followers of ${handle}:`, followers);
      await Promise.all(followers.map((follower)=>this.statusDao.postStatusToFeed(follower, newStatus)))
    };

    private async getAuthFromQuery(token: string) {
      const authInfo = await this.userDao.getAuth(token);
      if (authInfo == null) {
          throw new Error("auth is null");
      }
      const authToken = authInfo[0];
      const handle = authInfo[1];
      return {authToken,handle};
  }
}