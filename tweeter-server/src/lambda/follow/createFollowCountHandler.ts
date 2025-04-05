import { DynamoDaoFactory } from "../../dataAccess/factory/DynamoDaoFactory";
import { FollowService } from "../../model/service/FollowService";

export const createFollowCountHandler = (type: "follower" | "followee") => {
    return async (request: { token: string, userAlias: string }) => {
        const followService = new FollowService(new DynamoDaoFactory());
        const followCount = await followService.getFollowCount(type, request.token, request.userAlias);
        
        return {
            success: true,
            message: null,
            followCount: followCount,
        };
    };
}