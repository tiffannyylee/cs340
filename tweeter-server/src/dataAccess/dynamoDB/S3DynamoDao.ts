import { S3Dao } from "../S3Dao";

export class S3DynamoDao implements S3Dao {
    uploadProfileImage(alias: string, imageStream: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getProfileImageUrl(alias: string): Promise<String> {
        throw new Error("Method not implemented.");
    }
    
}