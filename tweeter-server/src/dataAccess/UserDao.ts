import { AuthToken, AuthTokenDto, User, UserDto } from "tweeter-shared";

export interface UserDao {
    //should these be dto or actual objects?
    getUser(handle:string) : Promise<UserDto>;
    createUser(user: User) : Promise<void>;
    updateUser(user: User) : Promise<void>;
    createAuth(handle : string) : Promise<void>;
    deleteAuth(token: string) : Promise<void>;
    getAuth(alias: string) : Promise<AuthToken>; //maybe use token to retrieve instead of alias
}