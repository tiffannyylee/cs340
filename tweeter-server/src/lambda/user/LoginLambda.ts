import { LoginRequest, AuthResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (request:LoginRequest) : Promise<AuthResponse> => {
    const userService = new UserService()
    //calls the service with the data from the request which is coming from the client
    const [user,authToken] = await userService.login(request.alias,request.password)
    return {
        success: true,
        message: "user has been logged in",
        user: user,
        authToken: authToken
    }
}