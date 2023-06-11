import * as React from "react";
import Modal from "react-native-modal";

import { ConfirmContext } from "@context/ConfirmDialog/confirmContext";
import {
  ButtonContainer,
  StyledButtonConfirm,
  StyledButtonDelete,
  TextAlert,
  ModalView,
  Container,
} from "./styles";
import { ButtonText } from "@styles/general";

const ConfirmDialog = () => {
  const { confirm, setConfirm } = React.useContext(ConfirmContext);
  const notInitialRender = React.useRef(false);

  function handleCancel() {
    return setConfirm((confirmState) => ({
      ...confirmState,
      callback: false,
      visibility: false,
    }));
  }

  function handleConfirm() {
    return setConfirm((confirmState) => ({
      ...confirmState,
      callback: true,
      visibility: false,
    }));
  }

  React.useEffect(() => {
    if (notInitialRender.current) {
      if (confirm.callback) {
        confirm.callbackFunction?.();
        setConfirm((confirmState) => ({
          ...confirmState,
          callbackFunction: undefined,
        }));
      }
    } else {
      notInitialRender.current = true;
    }
  }, [confirm.callback]);

  return (
    <Modal
      isVisible={confirm.visibility}
      swipeDirection={"down"}
      onSwipeComplete={() => handleCancel()}
      onBackdropPress={() => handleCancel()}
    >
      <Container>
        <ModalView center>
          <TextAlert>{confirm.title}</TextAlert>
          <ButtonContainer>
            <StyledButtonDelete onPress={handleCancel}>
              <ButtonText>CANCELAR</ButtonText>
            </StyledButtonDelete>
            <StyledButtonConfirm onPress={handleConfirm}>
              <ButtonText>OK</ButtonText>
            </StyledButtonConfirm>
          </ButtonContainer>
        </ModalView>
      </Container>
    </Modal>
  );
};

export default ConfirmDialog;
