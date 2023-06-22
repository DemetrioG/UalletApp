import { useContext, useEffect } from "react";
import { UserContext } from "../../../context/User/userContext";
import { usePromise } from "../../../hooks/usePromise";
import { getData } from "../query";

export const useGetData = () => {
  const { user, setUser } = useContext(UserContext);
  const { handleExecute } = usePromise(getData);

  async function execute() {
    if (user.name) return;
    handleExecute().then((data) =>
      setUser((rest) => ({
        ...rest,
        name: data.name,
        completeName: data.completeName,
        email: data.email,
      }))
    );
  }

  useEffect(() => {
    execute();
  }, []);

  return {};
};
