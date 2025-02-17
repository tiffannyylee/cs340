import { Status, Type } from "tweeter-shared";
import { Link } from "react-router-dom";
import useUserNavHook from "../userItem/UserNavigationHook";
import { UserNavParentView } from "../../presenters/UserNavParentPresenter";
import { UserNavigationPresenter } from "../../presenters/UserNavigationPresenter";

interface Props {
  status: Status;
}

const Post = (props: Props) => {
  // const { setDisplayedUser, currentUser, authToken } =
  //   useContext(UserInfoContext);
  // const { displayErrorMessage } = useToastListener();

  // const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
  //   event.preventDefault();

  //   try {
  //     const alias = extractAlias(event.target.toString());

  //     const user = await getUser(authToken!, alias);

  //     if (!!user) {
  //       if (currentUser!.equals(user)) {
  //         setDisplayedUser(currentUser!);
  //       } else {
  //         setDisplayedUser(user);
  //       }
  //     }
  //   } catch (error) {
  //     displayErrorMessage(`Failed to get user because of exception: ${error}`);
  //   }
  // };

  // const extractAlias = (value: string): string => {
  //   const index = value.indexOf("@");
  //   return value.substring(index);
  // };

  // const getUser = async (
  //   authToken: AuthToken,
  //   alias: string
  // ): Promise<User | null> => {
  //   // TODO: Replace with the result of calling server
  //   return FakeData.instance.findUserByAlias(alias);
  // };
  const presenterGenerator = (view: UserNavParentView) => new UserNavigationPresenter(view);
  const { navigateToUser } = useUserNavHook({presenterGenerator});


  return (
    <>
      {props.status.segments.map((segment, index) =>
        segment.type === Type.alias ? (
          <Link
            key={index}
            to={segment.text}
            onClick={(event) => navigateToUser(event)}
          >
            {segment.text}
          </Link>
        ) : segment.type === Type.url ? (
          <a
            key={index}
            href={segment.text}
            target="_blank"
            rel="noopener noreferrer"
          >
            {segment.text}
          </a>
        ) : segment.type === Type.newline ? (
          <br key={index} />
        ) : (
          segment.text
        )
      )}
    </>
  );
};

export default Post;
