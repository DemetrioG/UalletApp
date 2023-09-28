import { useEffect, useState } from "react";
import { authUser, currentUser } from "../utils/query.helper";
import { usePromise } from "./usePromise";

export const useLinked = () => {
  const { handleExecute } = usePromise(execute);
  const [linked, setLinked] = useState(false);

  async function execute() {
    const auth = await authUser();
    const current = await currentUser();
    if (!auth.uid || !current.uid) return;
    setLinked(auth.uid !== current.uid);
  }

  useEffect(() => {
    handleExecute();
  }, []);

  return {
    isLinkedInAnyAccount: linked,
  };
};
