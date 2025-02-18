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

    return {
        navigateToUser:presenter.navigateToUser,
        extractAlias:presenter.extractAlias
    }
}

export default useUserNavHook;