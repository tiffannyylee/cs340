import { TweeterRequest } from "./TweeterRequest";

export interface FollowOrUnfollowRequest extends TweeterRequest{
    token: string,
    userToDoAction: string
}