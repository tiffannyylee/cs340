import { UserDto, User, AuthToken, AuthTokenDto } from "tweeter-shared";
import { UserDao } from "../UserDao";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { BatchGetCommand, DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

export class UserDynamoDao implements UserDao {
    private dbClient = new DynamoDBClient({ region: "us-east-1" });
    private db = DynamoDBDocumentClient.from(this.dbClient);
    private usersTableName = "users";
    private authTableName = "auth"
    async getUser(handle: string): Promise<[ UserDto, string ] | null> {
        //query the user table by the handle to get a user item back
        const params = {
            TableName: this.usersTableName,
            Key: { user_handle: handle }
        };
        const result = await this.db.send(new GetCommand(params));
        if (!result.Item) {
            return null;
        }
        const user = {
            firstName: result.Item.first_name,
            lastName: result.Item.last_name,
            alias: result.Item.user_handle,
            imageUrl: result.Item.image_url
        } as UserDto;
        const password = result.Item.password
        return [user,password]
    }
    async batchGetUsersByAliases(aliases: string[]): Promise<UserDto[]> {
        if (aliases.length === 0) {
            return []; // Don't call DynamoDB if there's nothing to get
          }
        const keys = aliases.map(alias => ({ user_handle: alias}));
      
        const response = await this.db.send(new BatchGetCommand({
          RequestItems: {
            "users": {
              Keys: keys
            }
          }
        }));
      
        const items = response.Responses?.["users"] ?? [];
        return items.map((item)=>({firstName: item.first_name, lastName: item.last_name, alias: item.user_handle, imageUrl: item.image_url}) as UserDto)
      }
    async createUser(user: User, password:string): Promise<void> {
        //do a putitem command that puts a user item in the table
        const params = {
            TableName: this.usersTableName,
            Item : {
            user_handle: `@${user.alias}`, 
            first_name: user.firstName, 
            last_name: user.lastName, 
            image_url: user.imageUrl, 
            password: password}
        }
        await this.db.send(new PutCommand(params))
    }
    updateUser(user: User): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async createAuth(handle: string, token:string): Promise<void> {
        const params = {
            TableName: this.authTableName,
            Item: {
                token: token,
                user_handle: handle,
                created_at: Date.now(), // Optional: track token creation time
            }
        };
        await this.db.send(new PutCommand(params));
    }
    deleteAuth(token: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async getAuth(token: string): Promise<[AuthTokenDto, string]|null> {
        const params = {
            TableName : this.authTableName,
            Key: {token : token}
        };
        const result = await this.db.send(new GetCommand(params))
        if (!result.Item){
            return null
        }
        const authToken = {token: result.Item.token, timestamp: result.Item.created_at};
        const alias = result.Item.user_handle;
        return [authToken, alias]
    }
    
}