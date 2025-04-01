import { UserDto, User, AuthToken } from "tweeter-shared";
import { UserDao } from "../UserDao";

export class UserDynamoDao implements UserDao {
    getUser(handle: string): Promise<UserDto> {
        throw new Error("Method not implemented.");
    }
    createUser(user: User): Promise<void> {
        throw new Error("Method not implemented.");
    }
    updateUser(user: User): Promise<void> {
        throw new Error("Method not implemented.");
    }
    createAuth(handle: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    deleteAuth(token: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getAuth(alias: string): Promise<AuthToken> {
        throw new Error("Method not implemented.");
    }
    
}