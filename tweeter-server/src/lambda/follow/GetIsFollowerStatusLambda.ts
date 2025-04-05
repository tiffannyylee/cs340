import { GetIsFollowerRequest, PagedUserItemRequest } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { DynamoDaoFactory } from "../../dataAccess/factory/DynamoDaoFactory";

export const handler = async (request: GetIsFollowerRequest) => {
    const followService = new FollowService(new DynamoDaoFactory());
    const isFollower = await followService.getIsFollowerStatus(request.token, request.user, request.selectedUser)
    return {
        success : true,
        message : null,
        isFollower: isFollower
    }
}