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
import { CreditCard, Flag, LogOut, Settings } from "lucide-react-native";
import { ReturnUseDisclosure } from "../../types/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useLinked } from "../../hooks/useLinked";

export const Menu = (
  props: ReturnUseDisclosure
) => {
  const { theme }: IThemeProvider = useTheme();
  const { navigate } = useNavigation<NativeStackNavigationProp<any>>();
  const { data } = useContext(DataContext);
  const { setConfirm } = useContext(ConfirmContext);
  const { user, setUser } = useContext(UserContext);
  const [canLogout, setCanLogout] = useState(false);

  const { isLinkedInAnyAccount } = useLinked(props.isOpen);

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

  function goToScreen(path: string) {
    props.onClose();
    return setTimeout(() => navigate(path), 150);
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
        h="85%"
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
            <TouchableOpacity
              onPress={() => goToScreen("Configuracoes")}
              disabled={isLinkedInAnyAccount}
              style={{ opacity: isLinkedInAnyAccount ? 0.3 : 1 }}
            >
              <HStack alignItems="center" justifyContent="space-between">
                <Text>Configurações</Text>
                <Settings color={theme?.text} size={20} />
              </HStack>
            </TouchableOpacity>
          </VStack>
          <VStack borderBottomWidth={1} borderColor={theme?.primary} p={4}>
            <TouchableOpacity
              onPress={() => goToScreen("Tickets")}
              disabled={isLinkedInAnyAccount}
              style={{ opacity: isLinkedInAnyAccount ? 0.3 : 1 }}
            >
              <HStack alignItems="center" justifyContent="space-between">
                <Text>Suporte</Text>
                <Flag color={theme?.text} size={20} />
              </HStack>
            </TouchableOpacity>
          </VStack>
          <VStack borderBottomWidth={1} borderColor={theme?.primary} p={4}>
            <TouchableOpacity
              onPress={() => goToScreen("Plan")}
              disabled={isLinkedInAnyAccount}
              style={{ opacity: isLinkedInAnyAccount ? 0.3 : 1 }}
            >
              <HStack alignItems="center" justifyContent="space-between">
                <Text>Meu plano</Text>
                <CreditCard color={theme?.text} size={20} />
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
