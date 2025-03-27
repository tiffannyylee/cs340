import {
  GetIsFollowerRequest,
    PagedUserItemRequest,
    PagedUserItemResponse,
    User,
    UserDto,
    GetIsFollowerResponse,
    GetFollowCountRequest,
    GetFollowCountResponse,
    FollowOrUnfollowRequest,
    FollowOrUnfollowResponse,
    PostStatusRequest,
    PostStatusResponse,
    LoginRequest,
    AuthToken,
    AuthResponse,
    RegisterRequest,
  } from "tweeter-shared";
  import { ClientCommunicator } from "./ClientCommunicator";
import { LoadFeedOrStoryRequest } from "tweeter-shared";
import { LoadFeedOrStoryResponse } from "tweeter-shared";
import { Status } from "tweeter-shared";
import { GetUserRequest } from "tweeter-shared";
import { GetUserResponse } from "tweeter-shared";
  
  export class ServerFacade {
    private SERVER_URL = "https://v3hccfzuhf.execute-api.us-east-1.amazonaws.com/dev";
  
    private clientCommunicator = new ClientCommunicator(this.SERVER_URL);
  
    public async getMoreFollowees(
      request: PagedUserItemRequest
    ): Promise<[User[], boolean]> {
      const response = await this.clientCommunicator.doPost<
        PagedUserItemRequest,
        PagedUserItemResponse
      >(request, "/followee/list");
  
      // Convert the UserDto array returned by ClientCommunicator to a User array
      const items: User[] | null =
        response.success && response.items
          ? response.items.map((dto) => User.fromDto(dto) as User)
          : null;
  
      // Handle errors    
      if (response.success) {
        if (items == null) {
          throw new Error(`No followees found`);
        } else {
          return [items, response.hasMore];
        }
      } else {
        console.error(response);
        throw new Error(response.message?? "An unknown error occurred.");
      }
    }
    public async getMoreFollowers(
      request: PagedUserItemRequest
    ): Promise<[User[], boolean]> {
      const response = await this.clientCommunicator.doPost<
        PagedUserItemRequest,
        PagedUserItemResponse
      >(request, "/follower/list");
  
      // Convert the UserDto array returned by ClientCommunicator to a User array
      const items: User[] | null =
        response.success && response.items
          ? response.items.map((dto) => User.fromDto(dto) as User)
          : null;
  
      // Handle errors    
      if (response.success) {
        if (items == null) {
          throw new Error(`No followers found`);
        } else {
          return [items, response.hasMore];
        }
      } else {
        console.error(response);
        throw new Error(response.message?? "An unknown error occurred.");
      }
    }

    public async getIsFollower(request: GetIsFollowerRequest): Promise<boolean> {
      const response = await this.clientCommunicator.doPost<GetIsFollowerRequest,GetIsFollowerResponse>(request, "/follower/isFollower")

      if (response.success) {
        console.log(`success: ${response.success}, message:${response.message}, isFollower: ${response.isFollower}`)
        return response.isFollower
        } else {
          console.error(response);
          throw new Error(response.message ?? "An unknown error occurred.");
        }
      }
    public async getFollowerCount(request: GetFollowCountRequest): Promise<number> {
      const response = await this.clientCommunicator.doPost<GetFollowCountRequest,GetFollowCountResponse>(request, "/follower/count")
      if (response.success) {
        console.log(`success: ${response.success}, message:${response.message}, followerCount: ${response.followCount}`)
        return response.followCount
      } else {
        console.error(response);
        throw new Error(response.message?? "An unknown error with getting follower count occurred.")
      }
    }
    public async getFolloweeCount(request: GetFollowCountRequest) : Promise<number> {
      const response = await this.clientCommunicator.doPost<GetFollowCountRequest,GetFollowCountResponse>(request, "/followee/count")
      if (response.success) {
        console.log(`success: ${response.success}, message:${response.message}, followeeCount: ${response.followCount}`)
        return response.followCount
      } else {
        console.error(response);
        throw new Error(response.message?? "An unknown error with getting followee count occurred.")
      }
    }
    public async followUser(request: FollowOrUnfollowRequest) : Promise<[followerCount: number, followeeCount: number]> {
      const response = await this.clientCommunicator.doPost<FollowOrUnfollowRequest,FollowOrUnfollowResponse>(request, "/follower/follow")
      if (response.success) {
        console.log(`This is for follow user: message:${response.message}, followerCount:${response.followerCount}, followeeCount:${response.followeeCount}`)
        const followers = response.followerCount
        const followees = response.followeeCount
        return [followers, followees]
      } else {
        console.error(response);
        throw new Error(response.message??"An error with follow")
      }
    }
    public async unfollowUser(request: FollowOrUnfollowRequest) : Promise<[followerCount: number, followeeCount: number]> {
      const response = await this.clientCommunicator.doPost<FollowOrUnfollowRequest,FollowOrUnfollowResponse>(request, "/follower/unfollow")
      if (response.success) {
        console.log(`This is for unfollow user: message:${response.message}, followerCount:${response.followerCount}, followeeCount:${response.followeeCount}`)
        const followers = response.followerCount
        const followees = response.followeeCount
        return [followers, followees]
      } else {
        console.error(response);
        throw new Error(response.message??"An error with unfollow")
      }
    }
    //
    // Status
    //
    public async loadFeed(request: LoadFeedOrStoryRequest) : Promise<[Status[], boolean]> {
      const response = await this.clientCommunicator.doPost<LoadFeedOrStoryRequest,LoadFeedOrStoryResponse>(request, "/status/feed/load")
      // Convert the UserDto array returned by ClientCommunicator to a User array
      const items: Status[] | null =
      response.success && response.newItems
        ? response.newItems.map((dto) => Status.fromDto(dto) as Status)
        : null;
      if (response.success) {
        if (items == null) {
          throw new Error(`No feed found`);
        } else{
        console.log(`This is for loadfeed: message:${response.message}, hasMore:${response.hasMore}`)
        return [items, response.hasMore]
      } }else {
          console.error(response);
          throw new Error(response.message??"An error with loadFeed")
        }
      }
      public async loadStory(request: LoadFeedOrStoryRequest) : Promise<[Status[], boolean]> {
        const response = await this.clientCommunicator.doPost<LoadFeedOrStoryRequest,LoadFeedOrStoryResponse>(request, "/status/story/load")
        // Convert the UserDto array returned by ClientCommunicator to a User array
        const items: Status[] | null =
        response.success && response.newItems
          ? response.newItems.map((dto) => Status.fromDto(dto) as Status)
          : null;
        if (response.success) {
          if (items == null) {
            throw new Error(`No story found`);
          } else{
          console.log(`This is for loadstory: message:${response.message}, hasMore:${response.hasMore}`)
          return [items, response.hasMore]
        } }else {
            console.error(response);
            throw new Error(response.message??"An error with loadStory")
          }
        }
        public async postStory(request: PostStatusRequest) : Promise<void> {
          const response = await this.clientCommunicator.doPost<PostStatusRequest,PostStatusResponse>(request, "/status/post")
          if (response.success) {
            console.log("successful story post")
          }else {
            console.error(response);
            throw new Error(response.message??"An error with post status")
          }
        }
        public async login(request: LoginRequest) : Promise<[User, AuthToken]> {
          //recieve as dto, return response as obj
          const response = await this.clientCommunicator.doPost<LoginRequest,AuthResponse>(request, "/user/login")
          const user = User.fromDto(response.user)
          const auth = AuthToken.fromDto(response.authToken)
          if (response.success) {
            if (user == null || auth == null) {
              throw new Error('no user or auth found');
            } else {
              return[user,auth]
            }
          } else {
            console.error(response);
            throw new Error(response.message??"error with login")
          }
        }
        public async register(request: RegisterRequest) : Promise<[User, AuthToken]> {
          const response = await this.clientCommunicator.doPost<RegisterRequest,AuthResponse>(request, "/user/register")
          const user = User.fromDto(response.user)
          const auth = AuthToken.fromDto(response.authToken)
          if (response.success) {
            if (user == null || auth == null) {
              throw new Error('no user or auth found');
            } else {
              return[user,auth]
            }
          } else {
            console.error(response);
            throw new Error(response.message??"error with register")
          }
        }
        public async getUser(request: GetUserRequest) : Promise<User | null> {
          const response = await this.clientCommunicator.doPost<GetUserRequest,GetUserResponse>(request, "/user/get")
          const user = User.fromDto(response.user)
          if (response.success) {
            if(user==null){
              return null
            } else{
              return user
            }
          } else {
            console.error(response);
            throw new Error(response.message??"error with get user")
          }
        }
    }
  