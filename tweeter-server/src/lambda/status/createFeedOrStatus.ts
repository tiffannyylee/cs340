import { LoadFeedOrStoryRequest, LoadFeedOrStoryResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";

export const createFeedOrStatus = (type: "feed"|"status")=>{
    return async (request: LoadFeedOrStoryRequest) : Promise<LoadFeedOrStoryResponse> => {
        const statusService = new StatusService();
        const [newItems, hasMore] = await statusService.getFeedOrStory(type, request.token, request.userAlias, request.pageSize, request.lastItem);
        return {
            success: true,
            message: null,
            newItems: newItems,
            hasMore: hasMore
        };
    };
}