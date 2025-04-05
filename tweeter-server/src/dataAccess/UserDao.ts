import { AuthToken, AuthTokenDto, User, UserDto } from "tweeter-shared";

export interface UserDao {
    //should these be dto or actual objects?
    getUser(handle:string) : Promise<[ UserDto, string ] | null>;
    createUser(user: User, password: string) : Promise<void>;
    updateUser(user: User) : Promise<void>;
    createAuth(handle : string, token: string) : Promise<void>;
    deleteAuth(token: string) : Promise<void>;
    getAuth(token: string) : Promise<[AuthTokenDto, string] | null>; //maybe use token to retrieve instead of alias
    batchGetUsersByAliases(aliases: string[]): Promise<UserDto[]>
}