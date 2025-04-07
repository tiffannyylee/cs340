import { LoadFeedOrStoryRequest, LoadFeedOrStoryResponse, Status } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { DynamoDaoFactory } from "../../dataAccess/factory/DynamoDaoFactory";

export const createFeedOrStatus = (type: "feed"|"status")=>{
    return async (request: LoadFeedOrStoryRequest) : Promise<LoadFeedOrStoryResponse> => {
        const statusService = new StatusService(new DynamoDaoFactory());
        const [newItems, hasMore] = await statusService.getFeedOrStory(
            type, 
            request.token, 
            request.userAlias, 
            request.pageSize, 
            request.lastItem ? Status.fromDto(request.lastItem) : null);
        return {
            success: true,
            message: null,
            newItems: newItems,
            hasMore: hasMore
        };
    };
}