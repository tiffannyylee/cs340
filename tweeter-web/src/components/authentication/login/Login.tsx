import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import useToastListener from "../../toaster/ToastListenerHook";
import AuthentificationFields from "../AuthenticationFields";
import useUserInfo from "../../userInfo/UserInfoHook";
import { LoginParentPresenter } from "../../../presenters/LoginParentPresenter";
import { UserAuthView } from "../../../presenters/UserAuthPresenter";
import { LoginPresenter } from "../../../presenters/LoginPresenter";

interface Props {
  originalUrl?: string;
  // presenterGenerator : (view: UserAuthView) => LoginParentPresenter
  presenter?: LoginPresenter;
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading] = useState(false);

  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfo();
  const { displayErrorMessage } = useToastListener();

  const listener : UserAuthView = {
    displayErrorMessage: displayErrorMessage,
    updateUserInfo: updateUserInfo, 
    navigateTo: navigate
  }

  // const presenter = props.presenterGenerator(listener)
  const [presenter] = useState(props.presenter ?? new LoginPresenter(listener))

  const loginOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key == "Enter" && !presenter.checkSubmitButtonStatus(alias,password)) {
      presenter.doLogin(alias,password,rememberMe,props.originalUrl!);
    }
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
