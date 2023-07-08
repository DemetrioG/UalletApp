import * as React from "react";
import { Button, HStack, Pressable, Text, VStack } from "native-base";
import { useNavigation } from "@react-navigation/native";

import { ListEntries } from "../Entries/types";
import { BackgroundContainer } from "../../../styles/general";
import TabView, { IRoutes } from "../../../components/TabView";
import { IThemeProvider } from "../../../styles/baseTheme";
import { useTheme } from "styled-components";
import { ChevronLeft } from "lucide-react-native";
import { NewEntrieForm } from "./Form";
import {
  useFormEntries,
  useHandleConfirmDeleteEntrie,
} from "./hooks/useEntries";
import { FormProvider } from "react-hook-form";
import When from "../../../components/When";

export const NewEntries = ({
  route: { params },
}: {
  route: { params: ListEntries };
}) => {
  const id = params?.id;
  const { theme }: IThemeProvider = useTheme();
  const { goBack } = useNavigation();

  const { formMethods, isLoadingCreate, isLoadingUpdate, handleSubmit } =
    useFormEntries(params, id);

  const { isLoading: isLoadingDelete, handleDelete } =
    useHandleConfirmDeleteEntrie();

  const routes: IRoutes[] = [
    { key: "Receita", title: "Receita", selected: params?.type === "Receita" },
    { key: "Despesa", title: "Despesa", selected: params?.type === "Despesa" },
  ];

  const renderScene = ({
    route,
  }: {
    route: { key: string; title: string };
  }) => {
    return <NewEntrieForm route={route} params={params} />;
  };

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
        <FormProvider {...formMethods}>
          <TabView renderScene={renderScene} tabRoutes={routes} />
          <When is={!id}>
            <Button isLoading={isLoadingCreate} onPress={handleSubmit}>
              <Text fontWeight="bold" color="white">
                Cadastrar
              </Text>
            </Button>
          </When>
          <When is={!!id && formMethods.formState.isDirty}>
            <Button
              isLoading={isLoadingUpdate}
              isDisabled={isLoadingDelete}
              onPress={handleSubmit}
            >
              <Text fontWeight="bold" color="white">
                Atualizar
              </Text>
            </Button>
          </When>
          <When is={!!id}>
            <Button
              variant="outline"
              isLoading={isLoadingDelete}
              isDisabled={isLoadingUpdate}
              onPress={() => handleDelete(params)}
            >
              <Text fontWeight="bold" color={theme?.blue}>
                Excluir
              </Text>
            </Button>
          </When>
        </FormProvider>
      </VStack>
    </BackgroundContainer>
  );
};
