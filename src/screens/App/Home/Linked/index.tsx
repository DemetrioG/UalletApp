import { HStack, Pressable, Text, VStack } from "native-base";
import { IThemeProvider } from "../../../../styles/baseTheme";
import { useTheme } from "styled-components";
import Tooltip from "../../../../components/Tooltip";
import { Link } from "lucide-react-native";
import { FetchableSelectInputSharedAccounts } from "../../../../components/Inputs/FetchableSelectInputSharedAccounts";
import { useContext } from "react";
import { UserContext } from "../../../../context/User/userContext";

export const Linked = () => {
  const { theme }: IThemeProvider = useTheme();
  const { user } = useContext(UserContext);
  return (
    <VStack
      backgroundColor={theme?.secondary}
      borderRadius={30}
      p={4}
      pt={5}
      space={5}
    >
      <HStack justifyContent="space-between" alignItems="center" mb={2}>
        <Text fontWeight={600}>Conta selecionada</Text>
        <Pressable>
          <Tooltip label="Seus lançamentos Realizados/Projetados">
            <Link color={theme?.text} />
          </Tooltip>
        </Pressable>
      </HStack>
      <FetchableSelectInputSharedAccounts
        defaultValue={user.uid}
        variant="filled"
      />
    </VStack>
  );
};
