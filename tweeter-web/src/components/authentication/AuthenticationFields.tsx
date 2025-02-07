import { useContext, useState } from "react";
import { User, AuthToken, FakeData } from "tweeter-shared";
import { UserInfoContext } from "../userInfo/UserInfoProvider";
import { useNavigate } from "react-router-dom";
import useToastListener from "../toaster/ToastListenerHook";

interface Props {
    originalUrl?: string;
    onKeyDownHandler?: (event: React.KeyboardEvent<HTMLElement>) => void;
    alias: string;
    setAlias: (value: string) => void;
    password: string;
    setPassword: (value: string) => void;
  }

const AuthentificationFields = (props:Props) => {
    const [alias, setAlias] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { updateUserInfo } = useContext(UserInfoContext);
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();
    const { displayErrorMessage } = useToastListener();

    const checkSubmitButtonStatus = (): boolean => {
        return !props.alias || !props.password;
      };
    

    const loginOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
        if (event.key == "Enter" && !checkSubmitButtonStatus()) {
          doLogin();
        }
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
      const doLogin = async () => {
        try {
          setIsLoading(true);
    
          const [user, authToken] = await login(props.alias, props.password);
    
          updateUserInfo(user, user, authToken, rememberMe);
    
          if (!!props.originalUrl) {
            navigate(props.originalUrl);
          } else {
            navigate("/");
          }
        } catch (error) {
          displayErrorMessage(
            `Failed to log user in because of exception: ${error}`
          );
        } finally {
          setIsLoading(false);
        }
      };

    return (
        <>
        <div className="form-floating">
        <input
          type="text"
          className="form-control"
          size={50}
          id="aliasInput"
          placeholder="name@example.com"
        //   onKeyDown={loginOnEnter}
          onKeyDown={props.onKeyDownHandler}
          onChange={(event) => props.setAlias(event.target.value)}
        />
        <label htmlFor="aliasInput">Alias</label>
      </div>
      <div className="form-floating mb-3">
        <input
          type="password"
          className="form-control bottom"
          id="passwordInput"
          placeholder="Password"
        //   onKeyDown={loginOnEnter}
          onKeyDown={props.onKeyDownHandler}
          onChange={(event) => props.setPassword(event.target.value)}
        />
        <label htmlFor="passwordInput">Password</label>
      </div>
      </>
    )
}
export default AuthentificationFields;