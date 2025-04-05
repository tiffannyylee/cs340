import { PagedUserItemRequest, PagedUserItemResponse, User } from "tweeter-shared"
import { FollowService } from "../../model/service/FollowService"
import { DynamoDaoFactory } from "../../dataAccess/factory/DynamoDaoFactory";

export const handler = async (request : PagedUserItemRequest) : Promise<PagedUserItemResponse> => {
    const followService = new FollowService(new DynamoDaoFactory());
    const [items, hasMore] = await followService.loadMoreFollowees(request.token, 
        request.userAlias, 
        request.pageSize, 
        request.lastItem ? User.fromDto(request.lastItem) : null)
    return {
        success: true,
        message: null,
        items: items,
        hasMore: hasMore
    }
}