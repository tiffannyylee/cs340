import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/StatusService";
import { PostStatusParentPresenter, PostStatusView } from "./PostStatusParentPresenter";

export class PostStatusPresenter extends PostStatusParentPresenter{
    private statusService: StatusService;
    public constructor(view:PostStatusView){
        super(view)
        this.statusService = new StatusService()
    }
    protected get view():PostStatusView {
      return super.view as PostStatusView
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
    }
  };
  public checkButtonStatus(post:string,authToken:AuthToken,currentUser:User):boolean {
    return !post.trim() || !authToken || !currentUser;
  };
}