import * as React from "react";
import { Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { StyledLottieView, TextAlert } from "./styles";
import { AlertContext } from "../../context/Alert/alertContext";
import {
  ButtonText,
  StyledButton,
  ModalContainer,
  ModalView,
} from "../../styles/generalStyled";

const ERROR = require("../../../assets/icons/error.json");
const SUCCESS = require("../../../assets/icons/check.json");

export default function Alert() {
  const { navigate } = useNavigation<NativeStackNavigationProp<any>>();
  const { alert, setAlert } = React.useContext(AlertContext);
  const typeIcon = alert.type == "error" ? ERROR : SUCCESS;

  function handleAccept() {
    if (alert.redirect) {
      navigate(alert.redirect);
    }

    setAlert((alertState) => ({
      ...alertState,
      visibility: false,
      redirect: null,
    }));
  }

  return (
    <Modal visible={true} transparent={true} animationType="fade">
      <ModalContainer>
        <ModalView center={true}>
          <StyledLottieView source={typeIcon} autoPlay={true} loop={false} />
          <TextAlert>{alert.title}</TextAlert>
          <StyledButton onPress={handleAccept}>
            <ButtonText>OK</ButtonText>
          </StyledButton>
        </ModalView>
      </ModalContainer>
    </Modal>
  );
}
