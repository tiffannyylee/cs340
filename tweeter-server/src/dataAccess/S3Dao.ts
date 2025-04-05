export interface S3Dao {
    putImage(fileName: string, imageStringBase64Encoded: string): Promise<string>
    getProfileImageUrl(alias:string) : Promise<String> //check this idk what it returns
}