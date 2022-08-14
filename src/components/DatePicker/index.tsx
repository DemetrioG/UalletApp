import * as React from "react";
import { Modal, ScrollView } from "react-native";

import { getStorage, setStorage } from "../../utils/storage.helper";
import { HeaderView, ItemPicker, TextItem, Title } from "./styles";
import { ModalContainer, ModalView } from "../../styles/general";
import Icon from "../Icon";
import { DataContext } from "../../context/Data/dataContext";

interface IDatePicker {
  options: string[] | number[];
  type: "Mês" | "Ano";
  visibility: boolean;
  next?: React.Dispatch<React.SetStateAction<boolean>>;
  setVisibility: React.Dispatch<React.SetStateAction<boolean>>;
}

const DatePicker = ({
  options,
  setVisibility,
  type,
  visibility,
  next,
}: IDatePicker) => {
  const { data, setData } = React.useContext(DataContext);

  const handleSubmitItem = (item: string | number, index: number) => {
    setVisibility(false);
    setStorage(type, type == "Mês" ? index + 1 : item);
    next ? next(true) : null;
  };

  const ITEM = options.map((item, index) => {
    return (
      <ItemPicker key={index} onPress={() => handleSubmitItem(item, index)}>
        <TextItem type={type}>{item}</TextItem>
        <Icon name="chevron-right" size={20} />
      </ItemPicker>
    );
  });

  // Pega a referência de Mês e Ano, e coloca no Contexto
  React.useEffect(() => {
    (async function loadStorage() {
      const storedMonth = await getStorage("Mês");
      const storedYear = await getStorage("Ano");

      if (storedMonth && type === "Mês") {
        return setData((dataState) => ({
          ...dataState,
          month: storedMonth,
        }));
      } else if (storedYear && type === "Ano") {
        return setData((dataState) => ({
          ...dataState,
          year: storedYear,
        }));
      } else {
        return setData((dataState) => ({
          ...dataState,
          month: type == "Mês" ? new Date().getMonth() + 1 : dataState.month,
          year: type == "Ano" ? new Date().getFullYear() : dataState.year,
        }));
      }
    })();
  }, [visibility]);

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visibility}
      onRequestClose={() => setVisibility(false)}
    >
      <ModalContainer>
        <ModalView>
          <HeaderView>
            <Title>
              {type} • {type == "Mês" ? options[data.month - 1] : data.year}
            </Title>
            <Icon
              name="x"
              size={20}
              colorVariant="red"
              onPress={() => setVisibility(false)}
            />
          </HeaderView>
          <ScrollView showsVerticalScrollIndicator={false}>{ITEM}</ScrollView>
        </ModalView>
      </ModalContainer>
    </Modal>
  );
};

export default DatePicker;
