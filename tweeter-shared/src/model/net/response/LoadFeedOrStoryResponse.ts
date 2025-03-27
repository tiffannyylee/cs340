import { StatusDto } from "../../dto/StatusDto";
import { TweeterResponse } from "./TweeterResponse";

export interface LoadFeedOrStoryResponse extends TweeterResponse{
    newItems: StatusDto[] | null,
    hasMore: boolean
}