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
  public normalizeAlias(alias: string): string {
    return alias.startsWith("@") ? alias : `@${alias}`;
  }
  private async loadMoreStatusItems ( tableName: "feed"|"story", keyName:string, userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null): Promise<[StatusDto[], boolean]> {
      userAlias = this.normalizeAlias(userAlias)
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
        userAlias = this.normalizeAlias(userAlias)
        return await this.loadMoreStatusItems("feed", "user_handle", userAlias, pageSize, lastItem)      
      };

    public async loadMoreStoryItems(
      authToken: string,
      userAlias: string,
      pageSize: number,
      lastItem: StatusDto | null
    ): Promise<[StatusDto[], boolean]> {
      userAlias = this.normalizeAlias(userAlias)
      return await this.loadMoreStatusItems("story", "author_handle", userAlias, pageSize, lastItem)

    };

    public async getFeedOrStory(type: "feed" | "status", authToken: string, userAlias: string, pageSize:number, lastItem:StatusDto|null) {
      userAlias = this.normalizeAlias(userAlias)
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
      const {authToken, handle} = await this.getAuthFromQuery(token)
      await this.statusDao.postStatusToStory(newStatus)
      //this gets all followers of the user whos token was passed in
      // const followers = await this.followDao.getAllFollowers(handle)
      // console.log(`Followers of ${handle}:`, followers);
      // await Promise.all(followers.map((follower)=>this.statusDao.postStatusToFeed(follower, newStatus)))
    };

    public async postStatusToFeed(followers: string[], newStatus: StatusDto){
      await this.statusDao.batchAddStatusToFeed(followers, newStatus)
    }

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