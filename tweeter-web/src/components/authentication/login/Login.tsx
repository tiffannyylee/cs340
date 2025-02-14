import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import { AuthToken, FakeData, User } from "tweeter-shared";
import useToastListener from "../../toaster/ToastListenerHook";
import AuthentificationFields from "../AuthenticationFields";
import useUserInfo from "../../userInfo/UserInfoHook";
import { UserAuthPresenter, UserAuthView } from "../../../presenters/UserAuthPresenter";

interface Props {
  originalUrl?: string;
  presenterGenerator : (view: UserAuthView) => UserAuthPresenter
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfo();
  const { displayErrorMessage } = useToastListener();

  const listener : UserAuthView = {
    displayErrorMessage: displayErrorMessage,
    updateUserInfo: updateUserInfo, 
    navigateTo: navigate
  }

  const presenter = props.presenterGenerator(listener)

  // const checkSubmitButtonStatus = (): boolean => {
  //   return !alias || !password;
  // };
  //presenter.checkSubmitButtonStatus();

  const loginOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    // if (event.key == "Enter" && !checkSubmitButtonStatus()) {
    //   doLogin();
    // }
    if (event.key == "Enter" && !presenter.checkSubmitButtonStatus(alias,password)) {
      presenter.doLogin(alias,password,rememberMe,props.originalUrl!);
    }
  };

  const doLogin = async () => {
    presenter.doLogin(alias,password,rememberMe,props.originalUrl!)
    // try {
    //   setIsLoading(true);

    //   const [user, authToken] = await login(alias, password);

    //   updateUserInfo(user, user, authToken, rememberMe);

    //   if (!!props.originalUrl) {
    //     navigate(props.originalUrl);
    //   } else {
    //     navigate("/");
    //   }
    // } catch (error) {
    //   displayErrorMessage(
    //     `Failed to log user in because of exception: ${error}`
    //   );
    // } finally {
    //   setIsLoading(false);
    // }
  };


  const login = async (
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> => {
    // TODO: Replace with the result of calling the server
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid alias or password");
    }

    return [user, FakeData.instance.authToken];
  };

  const inputFieldGenerator = () => {
    return (
      <>
        <AuthentificationFields onKeyDownHandler={loginOnEnter} alias={alias}
        setAlias={setAlias}
        password={password}
        setPassword={setPassword} />
      </>
    );
  };

  const switchAuthenticationMethodGenerator = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldGenerator={inputFieldGenerator}
      switchAuthenticationMethodGenerator={switchAuthenticationMethodGenerator}
      setRememberMe={setRememberMe}
      submitButtonDisabled={()=>presenter.checkSubmitButtonStatus(alias,password)}
      isLoading={isLoading}
      submit={()=>presenter.doLogin(alias,password,rememberMe,props.originalUrl!)}
    />
  );
};

export default Login;
