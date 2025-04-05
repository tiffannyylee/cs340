import { LogoutRequest } from "tweeter-shared"
import { LogoutResponse } from "tweeter-shared"
import { UserService } from "../../model/service/UserService"
import { DynamoDaoFactory } from "../../dataAccess/factory/DynamoDaoFactory"
export const handler = async (request:LogoutRequest) : Promise<LogoutResponse> => {
    const userService = new UserService(new DynamoDaoFactory())
    //calls the service with the data from the request which is coming from the client
    userService.logout(request.token)
    return {
        success: true,
        message: "user has been logged out",
    }
}