import { FollowsDao } from "../FollowsDao";
import { S3Dao } from "../S3Dao";
import { StatusDao } from "../StatusDao";
import { UserDao } from "../UserDao";

export interface DaoFactory {
    createUserDao() : UserDao;
    createStatusDao() : StatusDao;
    createFollowsDao() : FollowsDao;
    createS3Dao() : S3Dao;
}