import { useContext, useEffect, useState } from "react";
import { usePromise } from "../../../../../../hooks/usePromise";
import { getUser } from "../query";
import { UserInfo } from "../types";
import { UserContext } from "../../../../../../context/User/userContext";

export const useGetUser = () => {
  const { user } = useContext(UserContext);
  const { isLoading, handleExecute } = usePromise<UserInfo>(getUser);

  const [userInfo, setUserInfo] = useState<UserInfo>();

  async function execute() {
    handleExecute(user.uid).then(setUserInfo);
  }

  useEffect(() => {
    execute();
  }, []);

  return {
    isLoading,
    data: userInfo,
  };
};
