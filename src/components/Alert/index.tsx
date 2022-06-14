import * as React from "react";
import { Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import {
  ButtonContainer,
  StyledButtonConfirm,
  StyledButtonDelete,
  StyledLottieView,
  TextAlert,
} from "./styles";
import { AlertContext } from "../../context/Alert/alertContext";
import {
  ButtonText,
  StyledButton,
  ModalContainer,
  ModalView,
} from "../../styles/general";

const ERROR = require("../../../assets/icons/error.json");
const SUCCESS = require("../../../assets/icons/check.json");
const CONFIRM = require("../../../assets/icons/confirm.json");

export default function Alert() {
  const { navigate } = useNavigation<NativeStackNavigationProp<any>>();
  const { alert, setAlert } = React.useContext(AlertContext);
  const notInitialRender = React.useRef(false);
  const typeIcon = alert.type === "error" ? ERROR : SUCCESS;

  function handleAccept() {
    if (alert.redirect) {
      navigate(alert.redirect);
    }

    return setAlert((alertState) => ({
      ...alertState,
      visibility: false,
      redirect: null,
    }));
  }

  function handleCancel() {
    return setAlert((alertState) => ({
      ...alertState,
      callback: false,
      visibility: false,
    }));
  }

  function handleConfirm() {
    return setAlert((alertState) => ({
      ...alertState,
      callback: true,
      visibility: false,
    }));
  }

  React.useEffect(() => {
    if (notInitialRender.current) {
      if (alert.callback) {
        alert.callbackFunction?.();
        setAlert((alertState) => ({
          ...alertState,
          callbackFunction: undefined,
        }));
      }
    } else {
      notInitialRender.current = true;
    }
  }, [alert.callback]);

  return (
    <Modal visible={alert.visibility} transparent animationType="fade">
      <ModalContainer>
        <ModalView center>
          {alert.type === "confirm" ? (
            <>
              <StyledLottieView source={CONFIRM} autoPlay loop={false} />
              <TextAlert>{alert.title}</TextAlert>
              <ButtonContainer>
                <StyledButtonDelete small onPress={handleCancel}>
                  <ButtonText>CANCELAR</ButtonText>
                </StyledButtonDelete>
                <StyledButtonConfirm small onPress={handleConfirm}>
                  <ButtonText>OK</ButtonText>
                </StyledButtonConfirm>
              </ButtonContainer>
            </>
          ) : (
            <>
              <StyledLottieView
                source={typeIcon}
                autoPlay
                loop={false}
                type={alert.type}
              />
              <TextAlert>{alert.title}</TextAlert>
              <StyledButton onPress={handleAccept}>
                <ButtonText>OK</ButtonText>
              </StyledButton>
            </>
          )}
        </ModalView>
      </ModalContainer>
    </Modal>
  );
}
