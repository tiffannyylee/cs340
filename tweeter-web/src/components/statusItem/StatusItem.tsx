import { Link } from "react-router-dom"
import Post from "./Post"
import { AuthToken, User, FakeData, Status } from "tweeter-shared";
import useToastListener from "../toaster/ToastListenerHook";
import { useContext } from "react";
import { UserInfoContext } from "../userInfo/UserInfoProvider";
import useUserNavHook from "../userItem/UserNavigationHook";

interface Props {
    status : Status;
    user : User;

}
const StatusItem = (props:Props) => {
    // const { displayErrorMessage } = useToastListener();
    // const { displayedUser, setDisplayedUser, currentUser, authToken } =
    // useContext(UserInfoContext);

    // const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
    //     event.preventDefault();
    
    //     try {
    //       const alias = extractAlias(event.target.toString());
    
    //       const user = await getUser(authToken!, alias);
    
    //       if (!!user) {
    //         if (currentUser!.equals(user)) {
    //           setDisplayedUser(currentUser!);
    //         } else {
    //           setDisplayedUser(user);
    //         }
    //       }
    //     } catch (error) {
    //       displayErrorMessage(`Failed to get user because of exception: ${error}`);
    //     }
    //   };
    //   const extractAlias = (value: string): string => {
    //     const index = value.indexOf("@");
    //     return value.substring(index);
    //   };
    
    //   const getUser = async (
    //     authToken: AuthToken,
    //     alias: string
    //   ): Promise<User | null> => {
    //     // TODO: Replace with the result of calling server
    //     return FakeData.instance.findUserByAlias(alias);
    //   };
    const { navigateToUser } = useUserNavHook();

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