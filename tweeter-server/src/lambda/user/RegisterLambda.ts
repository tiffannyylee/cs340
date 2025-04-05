import { RegisterRequest } from "tweeter-shared";
import { AuthResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { UserService } from "../../model/service/UserService";
import { DynamoDaoFactory } from "../../dataAccess/factory/DynamoDaoFactory";

export const handler = async (request:RegisterRequest) : Promise<AuthResponse> => {
    const userService = new UserService(new DynamoDaoFactory());
    const [user, authToken] = await userService.register(request.firstName,request.lastName,request.alias,request.password,request.userImageBytes,request.imageFileExtension)
    return {
        success: true,
        message: "user is registered",
        user: user,
        authToken: authToken
    }
}