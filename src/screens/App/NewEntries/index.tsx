import * as React from "react";
import { HStack, Pressable, Text, VStack } from "native-base";
import { useNavigation } from "@react-navigation/native";

import { ListEntries } from "../Entries/types";
import { BackgroundContainer } from "../../../styles/general";
import TabView, { IRoutes } from "../../../components/TabView";
import { IThemeProvider } from "../../../styles/baseTheme";
import { useTheme } from "styled-components";
import { ChevronLeft } from "lucide-react-native";
import { NewEntrieForm } from "./Form";

export const NewEntries = ({
  route: { params },
}: {
  route: { params: ListEntries };
}) => {
  const id = params?.id;
  const { theme }: IThemeProvider = useTheme();
  const { goBack } = useNavigation();

  const routes: IRoutes[] = [
    { key: "Receita", title: "Receita", selected: params?.type === "Receita" },
    { key: "Despesa", title: "Despesa", selected: params?.type === "Despesa" },
  ];

  const renderScene = ({
    route,
  }: {
    route: { key: string; title: string };
  }) => <NewEntrieForm route={route} params={params} />;

  return (
    <BackgroundContainer>
      <VStack
        backgroundColor={theme?.secondary}
        flex={1}
        p={5}
        borderTopLeftRadius="30px"
        borderTopRightRadius="30px"
      >
        <HStack alignItems="center" space={3} mb={6}>
          <Pressable onPress={goBack}>
            <ChevronLeft color={theme?.text} />
          </Pressable>
          <Text fontWeight={700}>
            {id ? "Editar lançamento" : "Novo lançamento"}
          </Text>
        </HStack>
        <TabView renderScene={renderScene} tabRoutes={routes} />
      </VStack>
    </BackgroundContainer>
  );
};
