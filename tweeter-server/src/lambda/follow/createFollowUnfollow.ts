import { FollowService } from "../../model/service/FollowService";

export const createFollowUnfollow = (type: "follow"|"unfollow")=>{
    return async (request: { token: string, userToDoAction: string }) => {
        const followService = new FollowService();
        const [followerCount, followeeCount] = await followService.getFollowOrUnfollow(type, request.token, request.userToDoAction);
        
        return {
            success: true,
            message: null,
            followerCount: followerCount,
            followeeCount: followeeCount
        };
    };
}