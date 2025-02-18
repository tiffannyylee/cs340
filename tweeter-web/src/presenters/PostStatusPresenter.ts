import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/StatusService";
import { PostStatusParentPresenter, PostStatusView } from "./PostStatusParentPresenter";
import Post from "../components/statusItem/Post";

export class PostStatusPresenter extends PostStatusParentPresenter{
    private statusService: StatusService;
    public constructor(view:PostStatusView){
        super(view)
        this.statusService = new StatusService()
    }

  public async submitPost(authToken:AuthToken, currentUser:User, post:string) {

    try {
      this.isLoading=true;
      this.view.displayInfoMessage("Posting status...", 0);

      const status = new Status(post, currentUser!, Date.now());

      await this.statusService.postStatus(authToken!, status);

      this.view.updatePost("");
      this.view.displayInfoMessage("Status posted!", 2000);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to post the status because of exception: ${error}`
      );
    } finally {
      this.isLoading=false;
      this.view.clearLastInfoMessage();
        // this.isLoading = false; // Ensure loading state is updated first
        // setTimeout(() => this.view.clearLastInfoMessage(), 100); // Slight delay before clearing message
    }
  };
}