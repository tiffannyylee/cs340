import "./UserInfo.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "./UserInfoHook";
import { UserInfoView, UserInfoParentPresenter } from "../../presenters/UserInfoParentPresenter";

interface Props {
  presenterGenerator : (view: UserInfoView) => UserInfoParentPresenter
}

const UserInfo = (props: Props) => {
  const [isFollower, setIsFollower] = useState(false);
  const [followeeCount, setFolloweeCount] = useState(-1);
  const [followerCount, setFollowerCount] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  const { displayErrorMessage, displayInfoMessage, clearLastInfoMessage } =
    useToastListener();

  const { currentUser, authToken, displayedUser, setDisplayedUser } =
    useUserInfo();

  if (!displayedUser) {
    setDisplayedUser(currentUser!);
  }
  const listener : UserInfoView = {
    displayErrorMessage: displayErrorMessage,
    displayInfoMessage: displayInfoMessage,
    clearLastInfoMessage: clearLastInfoMessage
  }

  const presenter = props.presenterGenerator(listener)
  
  useEffect(() => {
    presenter.setIsFollowerStatus(authToken!, currentUser!, displayedUser!, setIsFollower);
    presenter.setNumbFollowees(authToken!, displayedUser!, setFolloweeCount);
    presenter.setNumbFollowers(authToken!, displayedUser!, setFollowerCount);
    // setIsFollowerStatus(authToken!, currentUser!, displayedUser!);
    // setNumbFollowees(authToken!, displayedUser!);
    // setNumbFollowers(authToken!, displayedUser!);
  }, [displayedUser]);




  const switchToLoggedInUser = (event: React.MouseEvent): void => {
    event.preventDefault();
    setDisplayedUser(currentUser!);
  };


  return (
    <div className={isLoading ? "loading" : ""}>
      {currentUser === null || displayedUser === null || authToken === null ? (
        <></>
      ) : (
        <div className="container">
          <div className="row">
            <div className="col-auto p-3">
              <img
                src={displayedUser.imageUrl}
                className="img-fluid"
                width="100"
                alt="Posting user"
              />
            </div>
            <div className="col p-3">
              {displayedUser !== currentUser && (
                <p id="returnToLoggedInUser">
                  Return to{" "}
                  <Link
                    to={""}
                    onClick={(event) => switchToLoggedInUser(event)}
                  >
                    logged in user
                  </Link>
                </p>
              )}
              <h2>
                <b>{displayedUser.name}</b>
              </h2>
              <h3>{displayedUser.alias}</h3>
              <br />
              {followeeCount > -1 && followerCount > -1 && (
                <div>
                  Followees: {followeeCount} Followers: {followerCount}
                </div>
              )}
            </div>
            <form>
              {displayedUser !== currentUser && (
                <div className="form-group">
                  {isFollower ? (
                    <button
                      id="unFollowButton"
                      className="btn btn-md btn-secondary me-1"
                      type="submit"
                      style={{ width: "6em" }}
                      onClick={(event) => presenter.unfollowDisplayedUser(event,displayedUser,authToken,setIsFollower,setFollowerCount,setFolloweeCount)}
                      //onClick={(event) => unfollowDisplayedUser(event)}

                    >
                      {isLoading ? (
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : (
                        <div>Unfollow</div>
                      )}
                    </button>
                  ) : (
                    <button
                      id="followButton"
                      className="btn btn-md btn-primary me-1"
                      type="submit"
                      style={{ width: "6em" }}
                      onClick={(event) => presenter.followDisplayedUser(event,displayedUser,authToken,setIsFollower,setFollowerCount,setFolloweeCount)}
                      //onClick={(event) => followDisplayedUser(event)}
                    >
                      {isLoading ? (
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : (
                        <div>Follow</div>
                      )}
                    </button>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
