import { Status, StatusDto } from "tweeter-shared";
import { StatusDao } from "../StatusDao";
import { BatchWriteCommand, DynamoDBDocumentClient, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export interface RawStatusFromDb {
    author_handle: string;
    post: string;
    timestamp: number;
  }
  

export class StatusDynamoDao implements StatusDao {
    private dbClient = new DynamoDBClient({ region: "us-east-1" });
    private db = DynamoDBDocumentClient.from(this.dbClient);
    private storyTableName = "story"
    private feedTableName = "feed"
 
    async getStatus(tableName: string, keyAttr: string, handle: string, pageSize: number, lastItem?: StatusDto): Promise<[RawStatusFromDb[], boolean]> {
        //for the current user, query the feed table by their handle
        //sort the entries by time
        const command = new QueryCommand({
            TableName: tableName,
            KeyConditionExpression: `${keyAttr} = :h`,
            ExpressionAttributeValues: {
                ":h": handle,
            },
            Limit: pageSize,
            ScanIndexForward: false,
            ExclusiveStartKey: lastItem
            ? {
                [keyAttr]: handle,
                timestamp: lastItem.timestamp
              }
            : undefined
        })
        const response = await this.db.send(command)
        const statuses: RawStatusFromDb[] = (response.Items ?? []).map(item => ({
            author_handle: item.author_handle, // or fetch full user info if needed
            post: item.post,
            timestamp: item.timestamp,
        }));
    
        return [statuses, !!response.LastEvaluatedKey];
    }
    async postStatusToStory(status: StatusDto): Promise<void> {
        //for the logged in user, adds it to the story table with their handle as the pk, the status, and the timestamp
        const command = new PutCommand({
            TableName: this.storyTableName,
            Item: {
                author_handle: status.user.alias,
                timestamp: status.timestamp,
                post: status.post
            }
        })
        await this.db.send(command)
    }
    async postStatusToFeed(userHandle: string, status: StatusDto): Promise<void> {
        //for each follower of the logged in user, post the status under their feed and sort by order
        try {
            const command = new PutCommand({
                TableName: this.feedTableName,
                Item: {
                    user_handle: userHandle,
                    timestamp: status.timestamp,
                    author_handle: status.user.alias,
                    post: status.post
                }
            })
            await this.db.send(command)

        } catch (error) {
            console.error(`Failed to post to ${userHandle}'s feed`, error);
            throw error; // Re-throw to catch in calling code
        }
    }
    async batchAddStatusToFeed(followers: string[], status: StatusDto) {
        const putRequests = followers.map(follower => ({
            PutRequest: {
                Item: {
                    user_handle: follower,
                    timestamp: status.timestamp,  // use timestamp as sort key
                    author_handle: status.user.alias, 
                    post: status.post,
                }
            }
        }));
    
        const params = {
            RequestItems: {
                [this.feedTableName]: putRequests
            }
        };
    
        let response = await this.db.send(new BatchWriteCommand(params));

        while (response.UnprocessedItems && Object.keys(response.UnprocessedItems).length > 0) {
          console.log("Retrying unprocessed items...");
          response = await this.db.send(new BatchWriteCommand({
            RequestItems: response.UnprocessedItems
          }));
        }
    }
}