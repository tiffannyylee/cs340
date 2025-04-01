import { User } from "tweeter-shared";
import { FollowsDao } from "../FollowsDao";

export class FollowsDynamoDao implements FollowsDao {
    getFollowees(followerHandle: string, followeeHandle: string): Promise<User[]> {
        throw new Error("Method not implemented.");
    }
    getFollowers(followeeHandle: string, followerHandle: string): Promise<User[]> {
        throw new Error("Method not implemented.");
    }
    createFollowee(follower: string, followee: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    removeFollow(follower: string, followee: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    
}