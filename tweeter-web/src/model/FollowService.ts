import { AuthToken, User, FakeData, Status, PagedUserItemRequest } from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade"
import { setTextRange } from "typescript";
const server = new ServerFacade();

export class FollowService{
    public async loadMoreFollowers (
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: User | null
      ): Promise<[User[], boolean]> {
        // TODO: Replace with the result of calling server
        // return FakeData.instance.getPageOfUsers(lastItem, pageSize, userAlias);
        const request = {
          token: authToken.token,
          userAlias: userAlias,
          pageSize: pageSize,
          lastItem: lastItem ? lastItem.dto : null
        };
        return server.getMoreFollowers(request)
      };
    
      public async loadMoreFollowees  (
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: User | null
      ): Promise<[User[], boolean]> {
        // TODO: Replace with the result of calling server
        const request = {
          token: authToken.token,
          userAlias: userAlias,
          pageSize: pageSize,
          lastItem: lastItem ? lastItem.dto : null
        };
        // return FakeData.instance.getPageOfUsers(lastItem, pageSize, userAlias);
        return server.getMoreFollowees(request)
      };

      public async getIsFollowerStatus(
        authToken: AuthToken,
        user: User,
        selectedUser: User
      ): Promise<boolean> {
        // TODO: Replace with the result of calling server
        const request = {
          token: authToken.token,
          user: user.dto,
          selectedUser: selectedUser.dto
        }
        // return FakeData.instance.isFollower();
        return server.getIsFollower(request)
      };

      public async getFolloweeCount(
        authToken: AuthToken,
        user: User
      ): Promise<number> {
        // TODO: Replace with the result of calling server
        const request = {
          token: authToken.token,
          userAlias: user.alias
        }
        // return FakeData.instance.getFolloweeCount(user.alias);
        return server.getFolloweeCount(request)
      };

      public async getFollowerCount (
        authToken: AuthToken,
        user: User
      ): Promise<number> {
        // TODO: Replace with the result of calling server
        const request = {
          token: authToken.token,
          userAlias: user.alias
        }
        // return FakeData.instance.getFollowerCount(user.alias);
        return server.getFollowerCount(request)
      };

      public async follow (
        authToken: AuthToken,
        userToFollow: User
      ): Promise<[followerCount: number, followeeCount: number]> {
        // Pause so we can see the follow message. Remove when connected to the server
       // await new Promise((f) => setTimeout(f, 2000));
    
        // TODO: Call the server
    
        // const followerCount = await this.getFollowerCount(authToken, userToFollow);
        // const followeeCount = await this.getFolloweeCount(authToken, userToFollow);
    
        // return [followerCount, followeeCount];
        return server.followUser({token:authToken.token, userToDoAction: userToFollow.alias})
      };

      public async unfollow (
        authToken: AuthToken,
        userToUnfollow: User
      ): Promise<[followerCount: number, followeeCount: number]> {
        // Pause so we can see the unfollow message. Remove when connected to the server
       // await new Promise((f) => setTimeout(f, 2000));
    
        // TODO: Call the server
    
        // const followerCount = await this.getFollowerCount(authToken, userToUnfollow);
        // const followeeCount = await this.getFolloweeCount(authToken, userToUnfollow);
    
        // return [followerCount, followeeCount];
        return server.unfollowUser({token:authToken.token, userToDoAction: userToUnfollow.alias})

      };
      
      
}