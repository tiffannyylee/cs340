export interface S3Dao {
    uploadProfileImage(alias: string, imageStream: string) : Promise<void>;
    getProfileImageUrl(alias:string) : Promise<String> //check this idk what it returns
}