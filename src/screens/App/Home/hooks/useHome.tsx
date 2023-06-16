import { useContext, useEffect, useState } from "react";
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

import firebase from "../../../../services/firebase";
import { ReturnUseDisclosure } from "../../../../types/types";

export const useGetLastEntries = () => {
  const {
    data: { month, year, modality },
  } = useContext(DataContext);
  const { isLoading, handleExecute } = usePromise<any[]>(getLastEntry);

  const [lastEntries, setLastEntries] = useState<any[]>([]);

  async function execute() {
    if (!year) return setLastEntries([]);
    return handleExecute({ month, year, modality }).then((entries) =>
      setLastEntries(entries)
    );
  }

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
    usePromise<
      firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>
    >(completeUser);

  async function execute() {
    return handleExecute().then((v) => {
      setUser((rest) => ({
        ...rest,
        complete: true,
      }));
      if (!v.data()?.birthDate) return navigate("Home/Complete");
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
  const { handleExecute } = usePromise<
    firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>
  >(checkFutureDebitsToConsolidate);

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
