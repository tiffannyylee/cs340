import { GetUserRequest, GetUserResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDaoFactory } from "../../dataAccess/factory/DynamoDaoFactory";

export const handler = async (request:GetUserRequest) : Promise<GetUserResponse> => {
    const userService = new UserService(new DynamoDaoFactory());
    const user = await userService.getUser(request.token,request.alias)
    return {
        success:true,
        message:"here is the user",
        user:user
    }
}