import { PostStatusRequest, PostStatusResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService"
import { DynamoDaoFactory } from "../../dataAccess/factory/DynamoDaoFactory";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";


export const handler = async (request:PostStatusRequest) : Promise<PostStatusResponse> => {
    let sqsClient = new SQSClient({ region: "us-east-1" });
    const statusService = new StatusService(new DynamoDaoFactory());
    try {
       await statusService.postStatus(request.token, request.newStatus)
       await sendMessage()
       return {
        success: true,
        message: "Status posted successfully",
    }
    } catch (error) {
        console.error("Error posting status:", error); 
        return { success: false, message: "Failed to post status." };
    }
    async function sendMessage() {
        const sqs_url = "https://sqs.us-east-1.amazonaws.com/585008063095/PostStatusQueue";
        const messageBody = JSON.stringify({
            token: request.token,
            user_handle: request.newStatus.user.alias,
            status: request.newStatus,
        });
      
        const params = {
          //DelaySeconds: 10,
          MessageBody: messageBody,
          QueueUrl: sqs_url,
        };
      
        const data = await sqsClient.send(new SendMessageCommand(params));
        console.log("Success, message sent to Post Status Queue. MessageID:", data.MessageId);
      }
      
}


