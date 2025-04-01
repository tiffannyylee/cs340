import { Status } from "tweeter-shared";

export interface StatusDao {
    // needs to return has more?
    getFeed(handle: string, time : number) : Promise<Status[]>
    getStory(handle: string, time: number) : Promise<Status[]>
    postStatus(status : Status) : Promise<void>;
    //add to feed and remove from feed?

}