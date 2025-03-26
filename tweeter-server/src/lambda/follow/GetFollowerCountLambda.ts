
import { createFollowCountHandler } from "./createFollowCountHandler";

// export const handler= async (request:GetFollowerCountRequest) : Promise<GetFollowerCountResponse>=>{
//     const followService = new FollowService();
//     const followerCount = await followService.getFollowerCount(request.token, request.userAlias)
//     return {
//         success: true,
//         message: null,
//         followerCount: followerCount,
//     }
// }
export const handler = createFollowCountHandler("follower")