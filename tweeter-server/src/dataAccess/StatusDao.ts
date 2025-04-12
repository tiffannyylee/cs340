import { Status, StatusDto } from "tweeter-shared";
import { RawStatusFromDb } from "./dynamoDB/StatusDynamoDao";

export interface StatusDao {
    // needs to return has more?
    //getFeed(handle: string, pageSize: number, lastItem?: StatusDto): Promise<[RawStatusFromDb[], boolean]>    
    //postStatus(status : StatusDto) : Promise<void>;
    postStatusToFeed(userHandle: string, status: StatusDto): Promise<void>
    postStatusToStory(status: StatusDto): Promise<void>
    getStatus(tableName: string, keyAttr: string, handle: string, pageSize: number, lastItem?: StatusDto): Promise<[RawStatusFromDb[], boolean]> 
    batchAddStatusToFeed(followers: string[], status: StatusDto): Promise<void>
    //add to feed and remove from feed?
}