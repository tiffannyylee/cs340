import { PostStatusRequest, PostStatusResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService"
import { DynamoDaoFactory } from "../../dataAccess/factory/DynamoDaoFactory";

export const handler = async (request:PostStatusRequest) : Promise<PostStatusResponse> => {
    const statusService = new StatusService(new DynamoDaoFactory());
    try {
       await statusService.postStatus(request.token, request.newStatus)
       return {
        success: true,
        message: "Status posted successfully",
    }
    } catch (error) {
        console.error("Error posting status:", error); 
        return { success: false, message: "Failed to post status." };
    }
    
    
}