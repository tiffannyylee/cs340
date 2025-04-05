import { ObjectCannedACL, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { S3Dao } from "../S3Dao";

export class S3DynamoDao implements S3Dao {
    async putImage(
        fileName: string,
        imageStringBase64Encoded: string
      ): Promise<string> {
        let decodedImageBuffer: Buffer = Buffer.from(
          imageStringBase64Encoded,
          "base64"
        );
        const s3Params = {
          Bucket: "tweeter-s3-bucket",
          Key: "image/" + fileName,
          Body: decodedImageBuffer,
          ContentType: "image/png",
          ACL: ObjectCannedACL.public_read,
        };
        const c = new PutObjectCommand(s3Params);
        const client = new S3Client({ region: "us-east-1" });
        try {
          await client.send(c);
          return (
          `https://${"tweeter-s3-bucket"}.s3.${"us-east-1"}.amazonaws.com/image/${fileName}`
          );
        } catch (error) {
          throw Error("s3 put image failed with: " + error);
        }
      }
    
    async getProfileImageUrl(alias: string): Promise<String> {
        // const fileName = `${alias}-${Date.now()}.${imageFileExtension}`;
        const fileName = `${alias}-profile-pic`
        return (
            `https://${"tweeter-s3-bucket"}.s3.${"us-east-1"}.amazonaws.com/image/${fileName}`
            );
    }
    
}