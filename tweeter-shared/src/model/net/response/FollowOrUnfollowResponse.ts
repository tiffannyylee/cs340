import { TweeterResponse } from "./TweeterResponse";

export interface FollowOrUnfollowResponse extends TweeterResponse{
    followerCount: number,
    followeeCount: number
}