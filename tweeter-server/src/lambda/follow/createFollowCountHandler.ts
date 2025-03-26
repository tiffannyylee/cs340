import { FollowService } from "../../model/service/FollowService";

export const createFollowCountHandler = (type: "follower" | "followee") => {
    return async (request: { token: string, userAlias: string }) => {
        const followService = new FollowService();
        const followCount = await followService.getFollowCount(type, request.token, request.userAlias);
        
        return {
            success: true,
            message: null,
            followCount: followCount,
        };
    };
}