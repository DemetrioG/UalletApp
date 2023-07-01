import * as React from "react";
import {
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import { Button, HStack, Pressable, Text, VStack } from "native-base";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { ListEntries } from "../Entries/types";
import Picker from "../../../components/Picker";
import Calendar from "../../../components/Calendar";
import Icon from "../../../components/Icon";
import TextInput from "../../../components/TextInput";
import {
  CLASSIFICATION,
  ENTRY_SEGMENT,
} from "../../../components/Picker/options";
import { ConfirmContext } from "../../../context/ConfirmDialog/confirmContext";
import {
  dateValidation,
  convertDate,
  convertDateFromDatabase,
} from "../../../utils/date.helper";
import { numberToReal } from "../../../utils/number.helper";
import { FixEntryText, Schema } from "./styles";
import { BackgroundContainer } from "../../../styles/general";
import TabView, { IRoutes } from "../../../components/TabView";
import { IThemeProvider } from "../../../styles/baseTheme";
import { useTheme } from "styled-components";
import { ChevronLeft } from "lucide-react-native";
import { NewEntrieForm } from "./Form";
import { useFormEntries } from "./hooks/useEntries";

export const NewEntries = ({
  route: { params },
}: {
  route: { params: ListEntries };
}) => {
  const id = params?.id;
  const { formMethods } = useFormEntries();
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
  }) => {
    switch (route.key) {
      case "Receita":
        return <NewEntrieForm route={route} params={params} />;
      case "Despesa":
        return <NewEntrieForm route={route} params={params} />;
      default:
        return null;
    }
  };

  return (
    <FormProvider {...formMethods}>
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
    </FormProvider>
  );
};
