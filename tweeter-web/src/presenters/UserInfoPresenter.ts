import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model/FollowService";
import { UserInfoParentPresenter, UserInfoView } from "./UserInfoParentPresenter";

export class UserInfoPresenter extends UserInfoParentPresenter {
    private followService:FollowService
    public constructor(view:UserInfoView){
        super(view)
        this.followService=new FollowService()
    }
    public async setIsFollowerStatus(
        authToken: AuthToken,
        currentUser: User,
        displayedUser: User,
        setIsFollower: Function,
      ) {
        try {
          if (currentUser === displayedUser) {
            setIsFollower(false);
          } else {
            this.isFollower=(
              await this.followService.getIsFollowerStatus(authToken!, currentUser!, displayedUser!)
            );
          }
        } catch (error) {
          this.view.displayErrorMessage(
            `Failed to determine follower status because of exception: ${error}`
          );
        }
      };

      public async setNumbFollowees (
        authToken: AuthToken,
        displayedUser: User,
        setFolloweeCount: Function
      ) {
        try {
          setFolloweeCount(await this.followService.getFolloweeCount(authToken, displayedUser));
        } catch (error) {
          this.view.displayErrorMessage(
            `Failed to get followees count because of exception: ${error}`
          );
        }
      };

      public async setNumbFollowers (
        authToken: AuthToken,
        displayedUser: User,
        setFollowerCount: Function
      ) {
        try {
          setFollowerCount(await this.followService.getFollowerCount(authToken, displayedUser));
        } catch (error) {
          this.view.displayErrorMessage(
            `Failed to get followers count because of exception: ${error}`
          );
        }
      };

      public async followDisplayedUser (
        event: React.MouseEvent,
        displayedUser:User,
        authToken:AuthToken,
        setIsFollower: Function, 
        setFollowerCount: Function, 
        setFolloweeCount: Function
      ): Promise<void>{
        event.preventDefault();
    
        try {
          this.isLoading=true;
          this.view.displayInfoMessage(`Following ${displayedUser!.name}...`, 0);
    
          const [followerCount, followeeCount] = await this.followService.follow(
            authToken!,
            displayedUser!
          );
    
          setIsFollower(true);
          setFollowerCount(followerCount);
          setFolloweeCount(followeeCount);
        } catch (error) {
          this.view.displayErrorMessage(
            `Failed to follow user because of exception: ${error}`
          );
        } finally {
          this.view.clearLastInfoMessage();
          this.isLoading=false;
        }
      };

      public async unfollowDisplayedUser (
        event: React.MouseEvent,
        displayedUser:User,
        authToken:AuthToken,
        setIsFollower: Function, 
        setFollowerCount: Function, 
        setFolloweeCount: Function
      ): Promise<void> {
        event.preventDefault();
    
        try {
            this.isLoading=true;
          this.view.displayInfoMessage(
            `Unfollowing ${displayedUser!.name}...`,
            0
          );
    
          const [followerCount, followeeCount] = await this.followService.unfollow(
            authToken!,
            displayedUser!
          );
    
          setIsFollower(false);
          setFollowerCount(followerCount);
          setFolloweeCount(followeeCount);
        } catch (error) {
          this.view.displayErrorMessage(
            `Failed to unfollow user because of exception: ${error}`
          );
        } finally {
          this.view.clearLastInfoMessage();
          this.isLoading=false;
        }
      };
}