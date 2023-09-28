import { useEffect, useState } from "react";
import { authUser, currentUser } from "../utils/query.helper";
import { usePromise } from "./usePromise";
import { ReturnUseDisclosure } from "../types/types";

export const useLinked = (isOpen: ReturnUseDisclosure['isOpen']) => {
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
  }, [isOpen]);

  return {
    isLinkedInAnyAccount: linked,
  };
};
