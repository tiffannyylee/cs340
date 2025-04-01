import { User } from "tweeter-shared";

export interface FollowsDao {
    //needs to return hasmore?
    getFollowees(followerHandle:string, followeeHandle : string) : Promise<User[]>
    getFollowers(followeeHandle:string, followerHandle : string) : Promise<User[]>
    createFollowee(follower: string, followee: string) : Promise<void>
    removeFollow(follower: string, followee:string) : Promise<void>
}