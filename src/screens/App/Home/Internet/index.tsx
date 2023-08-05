import { useTheme } from "styled-components";
import { IThemeProvider } from "../../../../styles/baseTheme";
import { HStack, Pressable, Text, VStack } from "native-base";
import { WifiOff } from "lucide-react-native";
import { useContext } from "react";
import { DataContext } from "../../../../context/Data/dataContext";
import When from "../../../../components/When";

export const Internet = () => {
  const { theme }: IThemeProvider = useTheme();
  const { data } = useContext(DataContext);

  return (
    <When is={!data.isNetworkConnected}>
      <VStack
        backgroundColor={theme?.secondary}
        borderRadius="20px"
        p={4}
        space={2}
      >
        <HStack justifyContent="space-between" alignItems="center">
          <Text fontWeight={600}>Sem conexão com a internet</Text>
          <Pressable>
            <WifiOff color={theme?.red} />
          </Pressable>
        </HStack>
      </VStack>
    </When>
  );
};
