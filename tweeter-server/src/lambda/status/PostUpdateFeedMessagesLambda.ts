import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { DynamoDaoFactory } from "../../dataAccess/factory/DynamoDaoFactory";
import { FollowService } from "../../model/service/FollowService";
import { StatusDto, UserDto } from "tweeter-shared";
//receives the post and user, gets all the followers for that user, paginated, and sends them to the job q
let sqsClient = new SQSClient({ region: "us-east-1" });
let followService = new FollowService(new DynamoDaoFactory())
export const handler = async function (event:any ) {

    //process events
    for (let i = 0; i < event.Records.length; ++i) {
        const body = JSON.parse(event.Records[i].body);
        // needs to read the event and get the followers of the userhandle
        const token = body.token;
        const userHandle = body.user_handle;
        const status : StatusDto = body.status;
        let hasMore = false
        // let lastFollower : UserDto|null = null;
        let lastFollower: string | null = null;
        const pageSize = 250;
        do {
            //loadMoreFollowers returns [UserDto, boolean] a list of users and a boolean hasMore
            //const [followers, hasMoreResponse] = await followService.loadMoreFollowers(token,userHandle,pageSize,lastFollower) //can change the page size as things get bigger
            //const followersHandles : string[] = followers.map((follower)=>{return follower.alias})
            const [followersHandles, hasMoreResponse] = await followService.loadRawAliasesOfFollowers(token, userHandle,pageSize,lastFollower)
            const batchSize = 25; // AWS BatchWrite limit
            const promises = [];

            for (let i = 0; i < followersHandles.length; i += batchSize) {
                const batch = followersHandles.slice(i, i + batchSize);
                promises.push(sendMessage(status, batch)); // Fan-out SQS messages
            }

            await Promise.all(promises);  // Send all SQS messages in parallel

            if (followersHandles.length > 0) {
                lastFollower = followersHandles[followersHandles.length - 1];
                console.log("Setting lastFollower to:", lastFollower);
            }

            hasMore = hasMoreResponse;
            } while (hasMore)
        }

        return null;
      }

      //needs to send a message with the followers and the post to the other queue
      async function sendMessage(status:StatusDto, followersHandles: string[]) { //this might cause problems later when status is a json obj, check back
        const sqs_url = "https://sqs.us-east-1.amazonaws.com/585008063095/UpdateFeedQueue";
        const messageBody = JSON.stringify({
            followers: followersHandles, 
            status: status,
        });
      
        const params = {
          //DelaySeconds: 10,
          MessageBody: messageBody,
          QueueUrl: sqs_url,
        };
      
        const data = await sqsClient.send(new SendMessageCommand(params));
        console.log("Success, message sent to UpdateFeedQueue. MessageID:", data.MessageId);
      }
