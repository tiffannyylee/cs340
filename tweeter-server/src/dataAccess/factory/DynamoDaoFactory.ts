import { FollowsDao } from "../FollowsDao";
import { S3Dao } from "../S3Dao";
import { StatusDao } from "../StatusDao";
import { UserDao } from "../UserDao";
import { UserDynamoDao } from "../dynamoDB/UserDynamoDao";
import { DaoFactory } from "./DaoFactory";

export class DynamoDaoFactory implements DaoFactory {
    createUserDao(): UserDao {
        return new UserDynamoDao();
    }
    createStatusDao(): StatusDao {
        throw new Error("Method not implemented.");
    }
    createFollowsDao(): FollowsDao {
        throw new Error("Method not implemented.");
    }
    createS3Dao(): S3Dao {
        throw new Error("Method not implemented.");
    }
    
}