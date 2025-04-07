import { User } from "tweeter-shared";
import { FollowsDao } from "../FollowsDao";
import {
    DeleteCommand,
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    QueryCommand,
    UpdateCommand,
  } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";


export class FollowsDynamoDao implements FollowsDao {
    private dbClient = new DynamoDBClient({ region: "us-east-1" });
    private db = DynamoDBDocumentClient.from(this.dbClient);
    private tableName = "follows";

    async getFollowees(followerHandle: string, pageSize: number, lastFolloweeHandle: string | null): Promise<[string[], boolean]> {
        const command = new QueryCommand({
            TableName: this.tableName,
            KeyConditionExpression: "follower_handle = :f",
            ExpressionAttributeValues: {
              ":f": followerHandle,
            },
            Limit: pageSize, 
            ExclusiveStartKey: lastFolloweeHandle ? { follower_handle: followerHandle, followee_handle: lastFolloweeHandle } : undefined,
          });
        
          const response = await this.db.send(command);
          console.log(`db response get followees: ${response}`)
          const aliases: string[] = response.Items?.map(item => item.followee_handle) ?? [];

        
          // returns the page with the data and whether there is more
          return [aliases, response.LastEvaluatedKey !== undefined];
    }
    async getFollowers(followeeHandle: string, pageSize:number, lastFollowerHandle: string|null): Promise<[string[], boolean]> {
        const command = new QueryCommand({
            TableName: this.tableName,
            IndexName: "follows_index",
            KeyConditionExpression: "followee_handle = :followee",
            ExpressionAttributeValues: {
                ":followee": followeeHandle 
            },
            Limit: pageSize,
            ExclusiveStartKey: lastFollowerHandle? { followeeHandle : followeeHandle, follower_handle: lastFollowerHandle} : undefined,
        });
    
        const response = await this.db.send(command);
        const aliases: string[] = response.Items?.map(item => item.followee_handle) ?? [];
        return [aliases, response.LastEvaluatedKey !== undefined]
    }
    async getAllFollowers(followeeHandle: string) : Promise<string[]> {
      const command = new QueryCommand({
        TableName: this.tableName,
        IndexName: "follows_index",
        KeyConditionExpression: "followee_handle = :followee",
        ExpressionAttributeValues: {
          ":followee": followeeHandle
        }
      });
      const response = await this.db.send(command);
      const aliases: string[] = response.Items?.map(item => item.follower_handle) ?? [];
      return aliases
    }
    async getFolloweeCount(followerHandle: string): Promise<number> {
        const command = new QueryCommand({
          TableName: this.tableName,
          KeyConditionExpression: "follower_handle = :f",
          ExpressionAttributeValues: {
            ":f": followerHandle
          },
          Select: "COUNT"
        });
      
        const response = await this.db.send(command);
        return response.Count ?? 0;
      }
      async getFollowerCount(followeeHandle: string): Promise<number> {
        const command = new QueryCommand({
          TableName: this.tableName,
          IndexName: "follows_index",
          KeyConditionExpression: "followee_handle = :f",
          ExpressionAttributeValues: {
            ":f": followeeHandle
          },
          Select: "COUNT"
        });
      
        const response = await this.db.send(command);
        return response.Count ?? 0;
      }
    async createFollowee(follower: string, followee: string): Promise<void> {
        const command = new PutCommand({
            TableName: this.tableName,
            Item: {
                follower_handle: follower ,
                followee_handle: followee 
            }
        });
    
        await this.db.send(command);
    }
    async removeFollow(follower: string, followee: string): Promise<void> {
        const command = new DeleteCommand({
            TableName: this.tableName,
            Key: {
                follower_handle: follower ,
                followee_handle: followee
            }
        });
    
        await this.db.send(command);
    }
    async isFollower(user: string, selectedUser: string) : Promise<boolean> {
        //check if user is in the follower list of selected user or if selected user is in the followee list of user
        const command = new QueryCommand({
            TableName : this.tableName,
            KeyConditionExpression: "follower_handle = :f AND followee_handle = :e",
            ExpressionAttributeValues: {
              ":f": user,
              ":e": selectedUser
            }
        })
        const result = await this.db.send(command);
        return (result.Items?.length ?? 0) > 0;
    }
    
}