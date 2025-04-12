import { SQSClient } from "@aws-sdk/client-sqs";
import { DynamoDaoFactory } from "../../dataAccess/factory/DynamoDaoFactory";
import { StatusService } from "../../model/service/StatusService";

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const handler = async function (event:any ) {
    // this class needs to read the message from the queue, and update the feeds with the info
    let sqsClient = new SQSClient({ region: "us-east-1" });
    let statusService = new StatusService(new DynamoDaoFactory())
    for (let i = 0; i < event.Records.length; ++i) {
        let body = event.Records[i].body;
        //only parse if string
        if (typeof body === 'string') {
            body = JSON.parse(body);
        }
        const followers = body.followers;
        const status = body.status
        //i think i need to write a new batch write to feed function
        await statusService.postStatusToFeed(followers, status)
        await delay(1000);
      }
      return null;
}