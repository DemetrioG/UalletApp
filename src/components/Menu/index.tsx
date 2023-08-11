import { useContext, useState } from "react";
import { VStack, Avatar, Text, HStack } from "native-base";
import Modal from "react-native-modal";

import { ConfirmContext } from "../../context/ConfirmDialog/confirmContext";
import { DataContext } from "../../context/Data/dataContext";
import { initialUserState, UserContext } from "../../context/User/userContext";
import { removeAllStorage } from "../../utils/storage.helper";
import { useNavigation } from "@react-navigation/native";
import { refreshAuthDevice } from "./query";
import { IThemeProvider } from "../../styles/baseTheme";
import { useTheme } from "styled-components";
import { TouchableOpacity } from "react-native";
import { LogOut, Repeat, Settings } from "lucide-react-native";
import { ReturnUseDisclosure } from "../../types/types";

export const Menu = (props: ReturnUseDisclosure) => {
  const { theme }: IThemeProvider = useTheme();
  const { navigate } = useNavigation();
  const { data, setData } = useContext(DataContext);
  const { setConfirm } = useContext(ConfirmContext);
  const { user, setUser } = useContext(UserContext);
  const [canLogout, setCanLogout] = useState(false);

  function changeModality() {
    return setData((dataState) => ({
      ...dataState,
      modality: dataState.modality === "Real" ? "Projetado" : "Real",
    }));
  }

  function logout() {
    refreshAuthDevice(data.expoPushToken!);
    removeAllStorage().finally(() => {
      setUser(initialUserState);
    });
  }

  function handleLogout() {
    setCanLogout(true);
    props.onClose();
  }

  function goToConfiguracoesScreen() {
    props.onClose();
    //#TODO: adicionar tipagem de navegação
    return setTimeout(() => navigate("Configuracoes" as never), 150);
  }

  return (
    <Modal
      isVisible={props.isOpen}
      onSwipeComplete={props.onClose}
      onBackdropPress={props.onClose}
      swipeDirection={"down"}
      style={{ width: "100%", left: -20 }}
      onModalHide={() => {
        if (!canLogout) return;
        setConfirm({
          title: "Deseja realmente sair do app?",
          visibility: true,
          callbackFunction: logout,
        });
        setCanLogout(false);
      }}
      coverScreen
    >
      <VStack
        h="91%"
        w="100%"
        position="absolute"
        bottom={-20}
        background={theme?.tertiary}
        borderTopRadius="40px"
        space={8}
      >
        <VStack alignItems="center" mt={8} space={2}>
          <Avatar size={90} backgroundColor={theme?.blue}>
            <Text fontWeight={800} fontSize={34} color="white">
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
                <Text>{data.modality}</Text>
                <Repeat color={theme?.text} size={20} />
              </HStack>
            </TouchableOpacity>
          </VStack>
          <VStack borderBottomWidth={1} borderColor={theme?.primary} p={4}>
            <TouchableOpacity onPress={goToConfiguracoesScreen}>
              <HStack alignItems="center" justifyContent="space-between">
                <Text>Configurações</Text>
                <Settings color={theme?.text} size={20} />
              </HStack>
            </TouchableOpacity>
          </VStack>
          <VStack borderBottomWidth={1} borderColor={theme?.primary} p={4}>
            <TouchableOpacity onPress={handleLogout}>
              <HStack alignItems="center" justifyContent="space-between">
                <Text>Logout</Text>
                <LogOut color={theme?.text} size={20} />
              </HStack>
            </TouchableOpacity>
          </VStack>
        </VStack>
      </VStack>
    </Modal>
  );
};
