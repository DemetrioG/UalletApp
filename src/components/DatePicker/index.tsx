import * as React from "react";
import { Modal, ScrollView } from "react-native";

import { DateContext } from "../../context/Date/dateContext";
import { getStorage, setStorage } from "../../functions/storageData";
import { HeaderView, ItemPicker, TextItem, Title } from "./styles";
import { ModalContainer, ModalView, StyledIcon } from "../../styles/general";
import { colors } from "../../styles";

interface IDatePicker {
  options: string[] | number[];
  type: "Mês" | "Ano";
  visibility: boolean;
  next?: React.Dispatch<React.SetStateAction<boolean>>;
  setVisibility: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DatePicker({
  options,
  setVisibility,
  type,
  visibility,
  next,
}: IDatePicker) {
  const { date, setDate } = React.useContext(DateContext);

  const handleSubmitItem = (item: string | number, index: number) => {
    setVisibility(false);
    setStorage(type, type == "Mês" ? index + 1 : item);
    next ? next(true) : null;
  };

  const ITEM = options.map((item, index) => {
    return (
      <ItemPicker key={index} onPress={() => handleSubmitItem(item, index)}>
        <TextItem type={type}>{item}</TextItem>
        <StyledIcon name="chevron-right" size={20} />
      </ItemPicker>
    );
  });

  async function loadStorage() {
    const storedMonth = await getStorage("Mês");
    const storedYear = await getStorage("Ano");

    if (storedMonth && storedYear) {
      setDate((dateState) => ({
        ...dateState,
        month: type == "Mês" ? storedMonth : dateState.month,
        year: type == "Ano" ? storedYear : dateState.year,
      }));
    } else {
      setDate((dateState) => ({
        ...dateState,
        month: type == "Mês" ? new Date().getMonth() + 1 : dateState.month,
        year: type == "Ano" ? new Date().getFullYear() : dateState.year,
      }));
    }
  }

  // Pega a referência de Mês e Ano, e coloca no Contexto
  React.useEffect(() => {
    loadStorage();
  }, [visibility]);

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visibility}
      onRequestClose={() => setVisibility(false)}
    >
      <ModalContainer>
        <ModalView height={350}>
          <HeaderView>
            <Title>
              {type} • {type == "Mês" ? options[date.month - 1] : date.year}
            </Title>
            <StyledIcon
              name="x"
              size={20}
              color={colors.lightRed}
              onPress={() => setVisibility(false)}
            />
          </HeaderView>
          <ScrollView showsVerticalScrollIndicator={false}>{ITEM}</ScrollView>
        </ModalView>
      </ModalContainer>
    </Modal>
  );
}
