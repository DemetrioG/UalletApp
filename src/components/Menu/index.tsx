import * as React from "react";
import {
  Image,
  VStack,
  Pressable,
  useDisclose,
  Avatar,
  Text,
  HStack,
} from "native-base";
import { IVStackProps } from "native-base/lib/typescript/components/primitives/Stack/VStack";
import Modal from "react-native-modal";

import Icon from "../Icon";
import { ConfirmContext } from "../../context/ConfirmDialog/confirmContext";
import { DataContext } from "../../context/Data/dataContext";
import { initialUserState, UserContext } from "../../context/User/userContext";
import {
  initialLoaderState,
  LoaderContext,
} from "../../context/Loader/loaderContext";
import { removeAllStorage } from "../../utils/storage.helper";
import {
  AvatarMenu,
  AvatarMenuText,
  Container,
  Email,
  ItemContainer,
  ItemContent,
  ItemText,
  MenuContainer,
  Name,
  ProfileContainer,
} from "./styles";
import { useNavigation } from "@react-navigation/native";
import { refreshAuthDevice } from "./query";
import { IThemeProvider } from "../../styles/baseTheme";
import { useTheme } from "styled-components";
import { TouchableOpacity } from "react-native";
import { LogOut, Repeat, Settings } from "lucide-react-native";

export const Menu = ({ StackProps }: { StackProps?: IVStackProps }) => {
  const { theme }: IThemeProvider = useTheme();
  const { navigate } = useNavigation();
  const { data, setData } = React.useContext(DataContext);
  const { setLoader } = React.useContext(LoaderContext);
  const { setConfirm } = React.useContext(ConfirmContext);
  const { user, setUser } = React.useContext(UserContext);

  const modal = useDisclose();

  function changeModality() {
    return setData((dataState) => ({
      ...dataState,
      modality: dataState.modality === "Real" ? "Projetado" : "Real",
    }));
  }

  function logout() {
    refreshAuthDevice(data.expoPushToken!);
    removeAllStorage()
      .then(() => {})
      .catch(() => {})
      .finally(() => {
        setUser(initialUserState);
        setLoader(initialLoaderState);
      });
  }

  function handleLogout() {
    modal.onClose();
    setTimeout(() => {
      setConfirm({
        title: "Deseja realmente sair do app?",
        visibility: true,
        callbackFunction: logout,
      });
    }, 500);
  }

  function goToConfiguracoesScreen() {
    modal.onClose();
    //#TODO: adicionar tipagem de navegação
    return setTimeout(() => navigate("Configuracoes" as any), 150);
  }

  return (
    <VStack {...StackProps}>
      <Pressable onPress={modal.onToggle}>
        <Image source={LOGO_SMALL} width="25px" h="30px" alt="Logo Uallet" />
      </Pressable>
      <Modal
        isVisible={modal.isOpen}
        onSwipeComplete={modal.onClose}
        onBackdropPress={modal.onClose}
        swipeDirection={"down"}
      >
        <VStack
          h="90%"
          w="100%"
          position="absolute"
          bottom={-20}
          background={theme?.tertiary}
          borderTopRadius="40px"
          space={8}
        >
          <VStack alignItems="center" mt={8} space={2}>
            <Avatar size={90} backgroundColor={theme?.blue}>
              <Text fontWeight={800} fontSize={34}>
                {user.name[0]}
              </Text>
            </Avatar>
            <Text fontWeight={700}>{user.completeName}</Text>
            <Text fontSize="14px">{user.email}</Text>
          </VStack>
          <VStack
            h="100%"
            backgroundColor={theme?.secondary}
            p={5}
            borderTopRadius="40px"
          >
            <VStack borderBottomWidth={1} borderColor={theme?.primary} p={4}>
              <TouchableOpacity onPress={changeModality}>
                <HStack alignItems="center" justifyContent="space-between">
                  <ItemText>{data.modality}</ItemText>
                  <Repeat color={theme?.text} size={20} />
                </HStack>
              </TouchableOpacity>
            </VStack>
            <VStack borderBottomWidth={1} borderColor={theme?.primary} p={4}>
              <TouchableOpacity onPress={goToConfiguracoesScreen}>
                <HStack alignItems="center" justifyContent="space-between">
                  <ItemText>Configurações</ItemText>
                  <Settings color={theme?.text} size={20} />
                </HStack>
              </TouchableOpacity>
            </VStack>
            <VStack borderBottomWidth={1} borderColor={theme?.primary} p={4}>
              <TouchableOpacity onPress={handleLogout}>
                <HStack alignItems="center" justifyContent="space-between">
                  <ItemText>Logout</ItemText>
                  <LogOut color={theme?.text} size={20} />
                </HStack>
              </TouchableOpacity>
            </VStack>
          </VStack>
        </VStack>
      </Modal>
    </VStack>
  );
};

const LOGO_SMALL = require("../../../assets/images/logoSmall.png");
