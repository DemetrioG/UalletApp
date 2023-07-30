import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react-native";
import { HStack, Pressable, Text, VStack } from "native-base";
import { IThemeProvider } from "../../styles/baseTheme";
import { useTheme } from "styled-components";

export const StepableDatePicker = () => {
  const { theme }: IThemeProvider = useTheme();
  return (
    <HStack borderWidth={1} justifyContent="space-between">
      <Pressable p={1.5} borderWidth={1} borderColor={theme?.secondary}>
        <ChevronLeft color={theme?.text} />
      </Pressable>
      <HStack
        flex={1}
        alignItems="center"
        justifyContent="center"
        borderTopWidth={1}
        borderBottomWidth={1}
        borderColor={theme?.secondary}
      >
        <Pressable>
          <HStack space={1}>
            <Text>Jul 2023</Text>
            <VStack>
              <ChevronDown color={theme?.text} />
            </VStack>
          </HStack>
        </Pressable>
      </HStack>
      <Pressable p={1.5} borderWidth={1} borderColor={theme?.secondary}>
        <ChevronRight color={theme?.text} />
      </Pressable>
    </HStack>
  );
};
