import { AuthToken, User, FakeData } from "tweeter-shared";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "../userInfo/UserInfoHook";
import { UserNavParentPresenter, UserNavParentView } from "../../presenters/UserNavParentPresenter";

interface Props {
    presenterGenerator : (view: UserNavParentView) => UserNavParentPresenter
  }

const useUserNavHook = (props:Props) => {
    const { displayErrorMessage } = useToastListener();
    const { setDisplayedUser, currentUser, authToken } =
        useUserInfo();
    
    const listener : UserNavParentView = {
        displayErrorMessage: displayErrorMessage,
        getCurrentUser: () => currentUser,
        getAuthToken: () => authToken,
        setDisplayedUser
        };
        
    const presenter = props.presenterGenerator(listener);

    // const extractAlias = (value: string): string => {
    //     const index = value.indexOf("@");
    //     return value.substring(index);
    //     };

    // const getUser = async (
    //     authToken: AuthToken,
    //     alias: string
    //     ): Promise<User | null> => {
    //     // TODO: Replace with the result of calling server
    //     return FakeData.instance.findUserByAlias(alias);
    //     };
    // const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
    //     event.preventDefault();
    
    //     try {
    //         const alias = extractAlias(event.target.toString());
    
    //         const user = await getUser(authToken!, alias);
    
    //         if (!!user) {
    //         if (currentUser!.equals(user)) {
    //             setDisplayedUser(currentUser!);
    //         } else {
    //             setDisplayedUser(user);
    //         }
    //         }
    //     } catch (error) {
    //         displayErrorMessage(`Failed to get user because of exception: ${error}`);
    //     }
    //     };
    return {
        navigateToUser:presenter.navigateToUser,
        // getUser,
        extractAlias:presenter.extractAlias
    }
}

export default useUserNavHook;