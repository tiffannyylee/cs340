import { User, AuthToken, FakeData, AuthTokenDto, UserDto } from "tweeter-shared";
import { Buffer } from "buffer";
import { S3Dao } from "../../dataAccess/S3Dao";
import { DaoFactory } from "../../dataAccess/factory/DaoFactory";
import { UserDao } from "../../dataAccess/UserDao";
import bcryptjs from "bcryptjs";


export class UserService {
    private s3Dao : S3Dao;
    private userDao: UserDao;
    constructor(daoFactory : DaoFactory){
        this.s3Dao = daoFactory.createS3Dao();
        this.userDao = daoFactory.createUserDao();
    }
    public normalizeAlias(alias: string): string {
        return alias.startsWith("@") ? alias : `@${alias}`;
      }
    public async login (
        alias: string,
        password: string
        ): Promise<[UserDto, AuthTokenDto]> {
        alias = this.normalizeAlias(alias) 
        const { hashedPassword, user } = await this.getAliasAndPassword(alias);
        const isPasswordValid = await bcryptjs.compare(password, hashedPassword);
        if (!isPasswordValid){
            throw new Error("[Bad Request]: this password is not valid")
        }
        if (user === null) {
            throw new Error("[Bad Request}: Invalid alias or password");
        }
        const token = this.generateAuthToken()
        await this.userDao.createAuth(user.alias,token);
        const authToken = await this.getAuthFromQuery(token);
        return [user, authToken];
        };
        
    private async getAliasAndPassword(alias: string) {
        alias = this.normalizeAlias(alias)
        const userRecord = await this.userDao.getUser(alias);
        console.log(userRecord);
        if (userRecord == null) {
            throw new Error("alias or password incorrect");
        }
        const user = userRecord[0];
        const hashedPassword = userRecord[1];
        return { hashedPassword, user };
    }

    private async getAuthFromQuery(token: string) {
        const authInfo = await this.userDao.getAuth(token);
        if (authInfo == null) {
            throw new Error("auth is null");
        }
        const authToken = authInfo[0];
        const handle = authInfo[1];
        return authToken;
    }

    public async register (
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        userImageBytes: string, //Uint8Array,
        imageFileExtension: string
        ): Promise<[UserDto, AuthTokenDto]> {

        alias = this.normalizeAlias(alias)
        const fileName = `${alias}-profile-pic`;

        // Upload to S3
        const imageUrl = await this.s3Dao.putImage(fileName, userImageBytes);
        //hash password to store in db
        const salt = await bcryptjs.genSalt(10);
        const hashedPass = await bcryptjs.hash(password,salt)
        // create user and create auth
        const user = new User(firstName,lastName,alias,imageUrl)
        await this.userDao.createUser(user, hashedPass)
        const token = this.generateAuthToken()
        await this.userDao.createAuth(user.alias, token)
        await new Promise(resolve => setTimeout(resolve, 100));
        let attempt = 0;
        let authInfo = null;
        while (attempt < 3 && !authInfo) {
            authInfo = await this.userDao.getAuth(token);
            if (!authInfo) {
                await new Promise(resolve => setTimeout(resolve, 100)); // Wait for 100ms
            }
            attempt++;
        }

        if (!authInfo) {
            throw new Error("Auth token not found after multiple attempts");
        }
    
        if (user === null) {
            throw new Error("Invalid registration");
        }
        const userDto = user.dto
        if (authInfo==null){
            throw new Error("auth is null")
        }
        const authToken = authInfo[0]
        const handle = authInfo[1]
        return [userDto, authToken];
        };

    private generateAuthToken(): string {
            return Math.random().toString(36).substring(2); // Simple token generation
        }

    public async getUser (
        authToken: string,
        alias: string
        ): Promise<UserDto | null> {

        alias = this.normalizeAlias(alias)
        const userInfo = await this.userDao.getUser(alias);
        if (userInfo == null) {
            return null
        }
        const user = userInfo[0]
        return user
        };

    public async logout (authToken: string): Promise<void> {
        await new Promise((res) => setTimeout(res, 1000));
        };
}