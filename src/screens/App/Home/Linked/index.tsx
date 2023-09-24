import { HStack, Pressable, Text, VStack, useDisclose } from "native-base";
import { IThemeProvider } from "../../../../styles/baseTheme";
import { useTheme } from "styled-components";
import Tooltip from "../../../../components/Tooltip";
import { Heart } from "lucide-react-native";
import { FetchableSelectInputSharedAccounts } from "../../../../components/Inputs/FetchableSelectInputSharedAccounts";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/User/userContext";
import {
  getStorage,
  removeStorage,
  setStorage,
} from "../../../../utils/storage.helper";
import { DataContext } from "../../../../context/Data/dataContext";
import { ChangingAccount } from "./ChangingAccount";

export const Linked = () => {
  const { theme }: IThemeProvider = useTheme();
  const { user } = useContext(UserContext);
  const { setData } = useContext(DataContext);

  const [selectedValue, setSelectedValue] = useState<string | undefined>(
    user?.uid
  );

  const modal = useDisclose();

  useEffect(() => {
    const fetchDefaultValue = async () => {
      const linkedAccount = await getStorage("linkedUidRef");
      setSelectedValue(linkedAccount?.uid ?? user?.uid);
    };

    fetchDefaultValue();
  }, [user?.uid]);

  async function handleChangeUidRef(uid: string) {
    modal.onOpen();
    setSelectedValue(uid);

    const auth = await getStorage("authUser");
    if (auth?.uid === uid) {
      await removeStorage("linkedUidRef");
    } else {
      await setStorage("linkedUidRef", { uid });
    }
    setData((rest) => ({ ...rest, trigger: Math.random() }));

    await new Promise((resolve) => setTimeout(resolve, 1200));
    return modal.onClose();
  }

  return (
    <VStack backgroundColor={theme?.secondary} borderRadius={30} p={4} pt={5}>
      <HStack justifyContent="space-between" alignItems="center" mb={5}>
        <Text fontWeight={600}>Conta selecionada</Text>
        <Pressable>
          <Tooltip label="Seus lançamentos Realizados/Projetados">
            <Heart color={theme?.red} />
          </Tooltip>
        </Pressable>
      </HStack>
      <FetchableSelectInputSharedAccounts
        onValueChange={handleChangeUidRef}
        variant="filled"
        selectedValue={selectedValue}
      />
      <ChangingAccount {...modal} />
    </VStack>
  );
};
