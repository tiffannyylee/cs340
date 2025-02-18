import { AuthToken, FakeData, User } from "tweeter-shared";
import { Link } from "react-router-dom";
import useUserNavHook from "./UserNavigationHook";
import { UserNavParentView, UserNavParentPresenter } from "../../presenters/UserNavParentPresenter";
import { UserNavigationPresenter } from "../../presenters/UserNavigationPresenter";

interface Props {
  value: User;
}

const UserItem = (props: Props) => {
  const presenterGenerator = (view: UserNavParentView) => new UserNavigationPresenter(view);
  const { navigateToUser } = useUserNavHook({presenterGenerator});

  return (
    <div className="col bg-light mx-0 px-0">
      <div className="container px-0">
        <div className="row mx-0 px-0">
          <div className="col-auto p-3">
            <img
              src={props.value.imageUrl}
              className="img-fluid"
              width="80"
              alt="Posting user"
            />
          </div>
          <div className="col">
            <h2>
              <b>
                {props.value.firstName} {props.value.lastName}
              </b>{" "}
              -{" "}
              <Link
                to={props.value.alias}
                onClick={(event) => navigateToUser(event)}
              >
                {props.value.alias}
              </Link>
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserItem;
