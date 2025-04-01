import { Status } from "tweeter-shared";
import { StatusDao } from "../StatusDao";

export class StatusDynamoDao implements StatusDao {
    getFeed(handle: string, time: number): Promise<Status[]> {
        throw new Error("Method not implemented.");
    }
    getStory(handle: string, time: number): Promise<Status[]> {
        throw new Error("Method not implemented.");
    }
    postStatus(status: Status): Promise<void> {
        throw new Error("Method not implemented.");
    }
    
}