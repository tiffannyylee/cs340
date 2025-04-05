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
    private async getAliasAndPassword(alias: string) {
      const userRecord = await this.userDao.getUser(alias);
      console.log(userRecord);
      if (userRecord == null) {
          throw new Error("alias or password incorrect");
      }
      const user = userRecord[0];
      const hashedPassword = userRecord[1];
      return { hashedPassword, user };
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
    public async loadMoreFollowers (
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: UserDto | null
      ): Promise<[UserDto[], boolean]> {
        // TODO: Replace with the result of calling server
        //return a list of aliases, query the user table for each to get a list of users
        const [items, hasMore] = FakeData.instance.getPageOfUsers(User.fromDto(lastItem), pageSize, userAlias);
        // const [items, hasMore] =  await this.followDao.getFollowers()
        const dtos = items.map((user:User)=>user.dto)
        return [dtos, hasMore]
      };
    
      public async loadMoreFollowees  (
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: UserDto | null
      ): Promise<[UserDto[], boolean]> {
        // TODO: Replace with the result of calling server
        //const [items, hasMore] = FakeData.instance.getPageOfUsers(User.fromDto(lastItem), pageSize, userAlias);
        //return a list of aliases, query the user table for each to get a list of users

        const lastFolloweeHandle = lastItem ? lastItem.alias : null;
        const [items, hasMore] =  await this.followDao.getFollowees(userAlias,pageSize,lastFolloweeHandle)
        console.log(`loadfollowees: items:${items}`)
        if (items.length==0){
          items.push('@bethspack')
        }
        const users = await this.userDao.batchGetUsersByAliases(items)
        console.log(`loadfollowees: users:${users}`)
        return [users, hasMore];
      };


      public async getIsFollowerStatus(
        token: string,
        user: UserDto,
        selectedUser: UserDto
      ): Promise<boolean> {
        // TODO: Replace with the result of calling server
        //query to see if the selected follower is in the followers list of the user
        const isFollower = this.followDao.isFollower(user.alias,selectedUser.alias)
        return isFollower;
      };

      public async getFolloweeCount(
        token: string,
        userAlias: string
      ): Promise<number> {
        // TODO: Replace with the result of calling server
        //query the table for count of entries
        // return FakeData.instance.getFolloweeCount(userAlias);
        return this.followDao.getFolloweeCount(userAlias);
      };

      public async getFollowerCount (
        token: string,
        userAlias: string,
      ): Promise<number> {
        // TODO: Replace with the result of calling server
        //query the index table
        return this.followDao.getFollowerCount(userAlias);
      };

      public async getFollowCount(type: "follower" | "followee", token: string, userAlias: string): Promise<number> {
        if (type === "follower") {
            return await this.getFollowerCount(token, userAlias);
        } else {
            return await this.getFolloweeCount(token, userAlias);
        }
    }

      public async follow (
        token: string,
        userToFollow: string
      ): Promise<[followerCount: number, followeeCount: number]> {
        // Pause so we can see the follow message. Remove when connected to the server
        //await new Promise((f) => setTimeout(f, 2000));
    
        // TODO: Call the server
        const {authToken, handle} = await this.getAuthFromQuery(token)
        await this.followDao.createFollowee(handle, userToFollow)
        const followerCount = await this.getFollowerCount(token, userToFollow);
        const followeeCount = await this.getFolloweeCount(token, userToFollow);
    
        return [followerCount, followeeCount];
      };

      public async unfollow (
        token: string,
        userToUnfollow: string
      ): Promise<[followerCount: number, followeeCount: number]> {
        // Pause so we can see the unfollow message. Remove when connected to the server
        //await new Promise((f) => setTimeout(f, 2000));
    
        // TODO: Call the server
        const {authToken, handle} = await this.getAuthFromQuery(token);
        await this.followDao.removeFollow(handle, userToUnfollow)
        const followerCount = await this.getFollowerCount(token, userToUnfollow);
        const followeeCount = await this.getFolloweeCount(token, userToUnfollow);
    
        return [followerCount, followeeCount];
      };
      public async getFollowOrUnfollow(type: "follow" | "unfollow", token: string, userToDoAction: string): Promise<[followerCount: number, followeeCount: number]> {
        if (type === "follow") {
            return await this.follow(token, userToDoAction);
        } else {
            return await this.unfollow(token, userToDoAction);
        }
    }
      
      
}