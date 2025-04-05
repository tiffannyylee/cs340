import { User } from "tweeter-shared";

export interface FollowsDao {
    //needs to return hasmore?
    getFollowees(followerHandle: string, pageSize: number, lastFolloweeHandle: string | null) : Promise<[string[], boolean]>
    getFollowers(followeeHandle: string, pageSize:number, lastFollowerHandle: string|null): Promise<[string[], boolean]>
    createFollowee(follower: string, followee: string) : Promise<void>
    removeFollow(follower: string, followee:string) : Promise<void>
    getFolloweeCount(followerHandle: string): Promise<number>
    getFollowerCount(followeeHandle: string): Promise<number>
    isFollower(user: string, selectedUser: string) : Promise<boolean>
}