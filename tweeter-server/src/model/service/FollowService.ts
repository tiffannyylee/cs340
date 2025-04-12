import { AuthToken, FakeData, Status, UserDto, User } from "tweeter-shared";
import { FollowsDao } from "../../dataAccess/FollowsDao";
import { DaoFactory } from "../../dataAccess/factory/DaoFactory";
import { UserDao } from "../../dataAccess/UserDao";
import { S3Dao } from "../../dataAccess/S3Dao";
export class FollowService{
    private followDao : FollowsDao;
    private userDao : UserDao;
    private s3Dao : S3Dao;
    constructor(daoFactory : DaoFactory){
      this.followDao = daoFactory.createFollowsDao();
      this.userDao = daoFactory.createUserDao();
      this.s3Dao = daoFactory.createS3Dao();
    }
    public normalizeAlias(alias: string): string {
      return alias.startsWith("@") ? alias : `@${alias}`;
    }

  private async getAuthFromQuery(token: string) {
      const authInfo = await this.userDao.getAuth(token);
      if (authInfo == null) {
          throw new Error("Bad Request: Invalid or Expired Authtoken");
      }
      const authToken = authInfo[0];
      const handle = authInfo[1];
      return {authToken,handle};
  }
  public async getFollowersOfUser(alias:string) : Promise<string[]> {
    const followers = await this.followDao.getAllFollowers(alias)
    return followers
  }
  public async loadRawAliasesOfFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: string | null // just alias now
 ): Promise<[string[], boolean]> {
    userAlias = this.normalizeAlias(userAlias)
    const lastHandle = lastItem;
    return await this.followDao.getFollowers(userAlias, pageSize, lastHandle);
 }

  private async loadUsersByFollowType(
    type: "followers" | "followees",
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    userAlias = this.normalizeAlias(userAlias)
    const lastHandle = lastItem ? lastItem.alias : null;
  
    const [aliases, hasMore] =
      type === "followers"
        ? await this.followDao.getFollowers(userAlias, pageSize, lastHandle)
        : await this.followDao.getFollowees(userAlias, pageSize, lastHandle);
  
    if (aliases.length === 0) {
      return [[], false];
    }
  
    const users = await this.userDao.batchGetUsersByAliases(aliases);
    return [users, hasMore];
  }
  
    public async loadMoreFollowers (
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: UserDto | null
      ): Promise<[UserDto[], boolean]> {
        return this.loadUsersByFollowType("followers", userAlias, pageSize, lastItem);
      };
    
      public async loadMoreFollowees  (
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: UserDto | null
      ): Promise<[UserDto[], boolean]> {
        return this.loadUsersByFollowType("followees", userAlias, pageSize, lastItem)
      };


      public async getIsFollowerStatus(
        token: string,
        user: UserDto,
        selectedUser: UserDto
      ): Promise<boolean> {
        const isFollower = this.followDao.isFollower(this.normalizeAlias(user.alias),this.normalizeAlias(selectedUser.alias))
        return isFollower;
      };

      public async getFolloweeCount(
        token: string,
        userAlias: string
      ): Promise<number> {
        userAlias = this.normalizeAlias(userAlias)
        return this.followDao.getFolloweeCount(userAlias);
      };

      public async getFollowerCount (
        token: string,
        userAlias: string,
      ): Promise<number> {
        //query the index table
        userAlias = this.normalizeAlias(userAlias)
        return this.followDao.getFollowerCount(userAlias);
      };

      public async getFollowCount(type: "follower" | "followee", token: string, userAlias: string): Promise<number> {
        userAlias = this.normalizeAlias(userAlias)
        if (type === "follower") {
            return await this.getFollowerCount(token, userAlias);
        } else {
            return await this.getFolloweeCount(token, userAlias);
        }
    }

    private async getUpdatedFollowCounts(token: string, userAlias: string): Promise<[number, number]> {
      const followerCount = await this.getFollowerCount(token, userAlias);
      const followeeCount = await this.getFolloweeCount(token, userAlias);
      return [followerCount, followeeCount];
    }

      public async follow (
        token: string,
        userToFollow: string
      ): Promise<[followerCount: number, followeeCount: number]> {
        userToFollow = this.normalizeAlias(userToFollow)
        const {authToken, handle} = await this.getAuthFromQuery(token)
        await this.followDao.createFollowee(handle, userToFollow)
        return this.getUpdatedFollowCounts(token, userToFollow)
      };

      public async unfollow (
        token: string,
        userToUnfollow: string
      ): Promise<[followerCount: number, followeeCount: number]> {
        userToUnfollow = this.normalizeAlias(userToUnfollow)
        const {authToken, handle} = await this.getAuthFromQuery(token);
        await this.followDao.removeFollow(handle, userToUnfollow)
        return this.getUpdatedFollowCounts(token, userToUnfollow)
      };

      public async getFollowOrUnfollow(type: "follow" | "unfollow", token: string, userToDoAction: string): Promise<[followerCount: number, followeeCount: number]> {
        userToDoAction = this.normalizeAlias(userToDoAction)
        if (type === "follow") {
            return await this.follow(token, userToDoAction);
        } else {
            return await this.unfollow(token, userToDoAction);
        }
    }
      
      
}