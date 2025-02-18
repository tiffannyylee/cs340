import { Link } from "react-router-dom"
import Post from "./Post"
import {User, Status } from "tweeter-shared";
import useUserNavHook from "../userItem/UserNavigationHook";
import { UserNavParentView } from "../../presenters/UserNavParentPresenter";
import { UserNavigationPresenter } from "../../presenters/UserNavigationPresenter";

interface Props {
    status : Status;
    user : User;

}
const StatusItem = (props:Props) => {
    const presenterGenerator = (view: UserNavParentView) => new UserNavigationPresenter(view);
    const { navigateToUser } = useUserNavHook({presenterGenerator});

    return (
        <div className="col bg-light mx-0 px-0">
        <div className="container px-0">
          <div className="row mx-0 px-0">
            <div className="col-auto p-3">
              <img
                src={props.user.imageUrl}
                className="img-fluid"
                width="80"
                alt="Posting user"
              />
            </div>
            <div className="col">
              <h2>
                <b>
                  {props.user.firstName} {props.user.lastName}
                </b>{" "}
                -{" "}
                <Link
                  to={props.user.alias}
                  onClick={(event) => navigateToUser(event)}
                >
                  {props.user.alias}
                </Link>
              </h2>
              {props.status.formattedDate}
              <br />
              <Post status={props.status} />
            </div>
          </div>
        </div>
      </div>
    )
}

export default StatusItem;