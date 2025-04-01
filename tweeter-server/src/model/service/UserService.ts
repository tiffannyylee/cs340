import { User, AuthToken, FakeData, AuthTokenDto, UserDto } from "tweeter-shared";
import { Buffer } from "buffer";

export class UserService {
    public async login (
        alias: string,
        password: string
        ): Promise<[UserDto, AuthTokenDto]> {
        // TODO: Replace with the result of calling the server
        const user = FakeData.instance.firstUser; //get user from db
        if (user === null) {
            throw new Error("Invalid alias or password");
        }
        const userDto = user.dto
        const authDto = (FakeData.instance.authToken).dto //get authtoken from db
        //return a dto to send back to client
        return [userDto, authDto];
        };
    public async register (
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        userImageBytes: string, //Uint8Array,
        imageFileExtension: string
        ): Promise<[UserDto, AuthTokenDto]> {
        // Not neded now, but will be needed when you make the request to the server in milestone 3
        // const imageStringBase64: string = Buffer.from(userImageBytes).toString("base64");
    
        // TODO: Replace with the result of calling the server
        const user = FakeData.instance.firstUser;
    
        if (user === null) {
            throw new Error("Invalid registration");
        }
        const userDto = user.dto
        const authDto = (FakeData.instance.authToken).dto
        return [userDto, authDto];
        };
    public async getUser (
        authToken: string,
        alias: string
        ): Promise<UserDto | null> {
        // TODO: Replace with the result of calling server
        const user = FakeData.instance.findUserByAlias(alias);
        if (user == null) {
            return null
        }
        return user.dto
        };

    public async logout (authToken: string): Promise<void> {
        // Pause so we can see the logging out message. Delete when the call to the server is implemented.
        await new Promise((res) => setTimeout(res, 1000));
        };
}