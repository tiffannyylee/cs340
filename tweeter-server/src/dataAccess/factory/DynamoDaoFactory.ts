import { FollowsDao } from "../FollowsDao";
import { S3Dao } from "../S3Dao";
import { StatusDao } from "../StatusDao";
import { UserDao } from "../UserDao";
import { FollowsDynamoDao } from "../dynamoDB/FollowsDynamoDao";
import { S3DynamoDao } from "../dynamoDB/S3DynamoDao";
import { StatusDynamoDao } from "../dynamoDB/StatusDynamoDao";
import { UserDynamoDao } from "../dynamoDB/UserDynamoDao";
import { DaoFactory } from "./DaoFactory";

export class DynamoDaoFactory implements DaoFactory {
    createUserDao(): UserDao {
        return new UserDynamoDao();
    }
    createStatusDao(): StatusDao {
        return new StatusDynamoDao();
    }
    createFollowsDao(): FollowsDao {
        return new FollowsDynamoDao();
    }
    createS3Dao(): S3Dao {
        return new S3DynamoDao();
    }
    
}