import { useContext, useEffect, useState } from "react";
import {
  DocumentData,
  DocumentSnapshot,
  QuerySnapshot,
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DataContext } from "../../../../context/Data/dataContext";
import { usePromise } from "../../../../hooks/usePromise";
import {
  checkFutureDebitsToConsolidate,
  completeUser,
  getLastEntry,
} from "../querys";
import { UserContext } from "../../../../context/User/userContext";

import { ReturnUseDisclosure } from "../../../../types/types";

export const useGetLastEntries = () => {
  const {
    data: { month, year, modality, trigger },
  } = useContext(DataContext);
  const { isLoading, handleExecute } = usePromise<any[]>(getLastEntry);

  const [lastEntries, setLastEntries] = useState<any[]>([]);

  async function execute() {
    if (!year) return setLastEntries([]);
    return handleExecute({ month, year, modality }).then(setLastEntries);
  }

  useEffect(() => {
    execute();
  }, [month, year, modality, trigger]);

  return {
    isLoading,
    handleGetLastEntries: execute,
    lastEntries,
  };
};

export const useIsUserWithCompleteData = () => {
  const { user, setUser } = useContext(UserContext);
  const { navigate } = useNavigation<NativeStackNavigationProp<any>>();

  const { handleExecute } =
    usePromise<DocumentSnapshot<DocumentData>>(completeUser);

  async function execute() {
    return handleExecute().then((v) => {
      setUser((rest) => ({
        ...rest,
        complete: true,
      }));
      if (!v.data()?.birthdate) return navigate("Home/Complete");
    });
  }

  useEffect(() => {
    execute();
  }, []);

  return {
    isUserWithCompleteData: user.complete,
  };
};

export const useCheckConsolidation = ({ onOpen }: ReturnUseDisclosure) => {
  const { handleExecute } = usePromise<QuerySnapshot<DocumentData>>(
    checkFutureDebitsToConsolidate
  );

  async function execute() {
    return handleExecute().then((v) => {
      v.forEach((result) => {
        result.data() && onOpen();
      });
    });
  }

  useEffect(() => {
    execute();
  }, []);

  return {};
};
