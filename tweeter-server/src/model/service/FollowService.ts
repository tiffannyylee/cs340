import { AuthToken, User, FakeData, Status, UserDto } from "tweeter-shared/";

export class FollowService{
    public async loadMoreFollowers (
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: UserDto | null
      ): Promise<[UserDto[], boolean]> {
        // TODO: Replace with the result of calling server
        const [items, hasMore] = FakeData.instance.getPageOfUsers(this.getDomainObject(lastItem), pageSize, userAlias);
        const dtos = items.map((user)=>this.createDto(user))
        return [dtos, hasMore]
      };
    
      public async loadMoreFollowees  (
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: UserDto | null
      ): Promise<[UserDto[], boolean]> {
        // TODO: Replace with the result of calling server
        const [items, hasMore] = FakeData.instance.getPageOfUsers(this.getDomainObject(lastItem), pageSize, userAlias);
        const dtos = items.map((user)=>this.createDto(user));
        return [dtos, hasMore];
      };

      private createDto(user: User) : UserDto {
        return {
          firstName: user.firstName,
          lastName: user.lastName,
          alias: user.alias,
          imageUrl: user.imageUrl,
        }
      }

      private getDomainObject(dto:UserDto|null) : User | null {
        return dto == null ? null : new User(dto.firstName, dto.lastName, dto.alias, dto.imageUrl)
      }

      public async getIsFollowerStatus(
        token: string,
        user: UserDto,
        selectedUser: UserDto
      ): Promise<boolean> {
        // TODO: Replace with the result of calling server
        return FakeData.instance.isFollower();
      };

      public async getFolloweeCount(
        token: string,
        user: UserDto
      ): Promise<number> {
        // TODO: Replace with the result of calling server
        return FakeData.instance.getFolloweeCount(user.alias);
      };

      public async getFollowerCount (
        token: string,
        user: UserDto
      ): Promise<number> {
        // TODO: Replace with the result of calling server
        return FakeData.instance.getFollowerCount(user.alias);
      };

      public async follow (
        token: string,
        userToFollow: UserDto
      ): Promise<[followerCount: number, followeeCount: number]> {
        // Pause so we can see the follow message. Remove when connected to the server
        await new Promise((f) => setTimeout(f, 2000));
    
        // TODO: Call the server
    
        const followerCount = await this.getFollowerCount(token, userToFollow);
        const followeeCount = await this.getFolloweeCount(token, userToFollow);
    
        return [followerCount, followeeCount];
      };

      public async unfollow (
        token: string,
        userToUnfollow: UserDto
      ): Promise<[followerCount: number, followeeCount: number]> {
        // Pause so we can see the unfollow message. Remove when connected to the server
        await new Promise((f) => setTimeout(f, 2000));
    
        // TODO: Call the server
    
        const followerCount = await this.getFollowerCount(token, userToUnfollow);
        const followeeCount = await this.getFolloweeCount(token, userToUnfollow);
    
        return [followerCount, followeeCount];
      };
      
      
}