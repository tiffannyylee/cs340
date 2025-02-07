import { useContext } from "react";
import useToaster from "../toaster/ToastHook";
import { UserInfoContext } from "./UserInfoProvider";

const useUserInfo = () => useContext(UserInfoContext);

export default useUserInfo;