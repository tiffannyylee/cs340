import {
  GetIsFollowerRequest,
    PagedUserItemRequest,
    PagedUserItemResponse,
    User,
    UserDto,
    GetIsFollowerResponse,
  } from "tweeter-shared";
  import { ClientCommunicator } from "./ClientCommunicator";
  
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
    }
  